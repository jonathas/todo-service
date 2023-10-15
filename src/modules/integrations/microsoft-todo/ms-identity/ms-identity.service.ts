import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MicrosoftIntegrations } from '../microsoft-integrations.entity';
import { Repository } from 'typeorm';
import * as msal from '@azure/msal-node';
import { MicrosoftIdentityConfig } from '../../../../config/microsoft-identity.config';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../../users/users.service';

@Injectable()
export class MSIdentityService {
  private redirectUri: string;

  public constructor(
    private config: ConfigService,
    @InjectRepository(MicrosoftIntegrations)
    private microsoftIntegrationsRepository: Repository<MicrosoftIntegrations>,
    private usersService: UsersService
  ) {
    const microsoftIdentityConfig = this.config.get<MicrosoftIdentityConfig>('microsoftIdentity');
    this.redirectUri = microsoftIdentityConfig.redirectUri;
  }

  /**
   * Configuration object to be passed to MSAL instance on creation.
   */
  public getMsalConfig(msIdentity: MicrosoftIdentityConfig): msal.Configuration {
    return {
      auth: {
        clientId: msIdentity.clientId,
        authority: msIdentity.cloudInstance + msIdentity.tenantId,
        clientSecret: msIdentity.clientSecret
      },
      system: {
        loggerOptions: {
          loggerCallback(loglevel, message) {
            console.log(message);
          },
          piiLoggingEnabled: false,
          logLevel: msal.LogLevel.Info
        }
      }
    };
  }

  public getScopes() {
    return ['User.read', 'Tasks.ReadWrite', 'offline_access'];
  }

  public getTokensByCode(msalClient: msal.ConfidentialClientApplication, code: string) {
    const tokenRequest = {
      code,
      redirectUri: this.redirectUri,
      scopes: this.getScopes(),
      authority: 'https://login.microsoftonline.com/common'
    };

    return msalClient.acquireTokenByCode(tokenRequest);
  }

  public async saveTokens(
    authResponse: msal.AuthenticationResult,
    msalClient: msal.ConfidentialClientApplication
  ) {
    const { username } = authResponse.account;

    const data: Partial<MicrosoftIntegrations> = {
      id: null,
      accessToken: authResponse.accessToken,
      idToken: authResponse.idToken,
      expiresOn: authResponse.expiresOn,
      userId: null,
      refreshToken: this.getRefreshToken(msalClient)
    };

    let user = await this.usersService.findOneByEmail(username);
    if (!user) {
      user = await this.usersService.create(username);
    } else {
      const userTokens = await this.microsoftIntegrationsRepository.findOne({
        where: { userId: user.id }
      });
      if (userTokens) {
        data.id = userTokens.id;
      }
    }

    data.userId = user.id;
    return this.microsoftIntegrationsRepository.save(
      this.microsoftIntegrationsRepository.create(data)
    );
  }

  private getRefreshToken(msalClient: msal.ConfidentialClientApplication) {
    const tokenCache = msalClient.getTokenCache().serialize();
    const refreshTokenObject = JSON.parse(tokenCache).RefreshToken;
    return refreshTokenObject[Object.keys(refreshTokenObject)[0]].secret;
  }

  public getTokensFromDB(userId: number) {
    return this.microsoftIntegrationsRepository.findOne({ where: { userId } });
  }
}
