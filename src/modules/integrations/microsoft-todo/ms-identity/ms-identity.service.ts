import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MicrosoftIntegrations } from '../microsoft-integrations.entity';
import { Repository } from 'typeorm';
import * as msal from '@azure/msal-node';
import { MicrosoftGraphConfig } from '../../../../config/microsoft-graph.config';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../../users/users.service';
import { LoggerService } from '../../../../providers/logger/logger.service';

@Injectable()
export class MSIdentityService {
  private redirectUri: string;

  private msalConfig: msal.Configuration;

  public constructor(
    private config: ConfigService,
    @InjectRepository(MicrosoftIntegrations)
    private microsoftIntegrationsRepository: Repository<MicrosoftIntegrations>,
    private usersService: UsersService,
    private logger: LoggerService
  ) {
    this.logger.setContext(MSIdentityService.name);
    const microsoftGraphConfig = this.config.get<MicrosoftGraphConfig>('microsoftGraph');
    this.redirectUri = microsoftGraphConfig.redirectUri;

    this.msalConfig = this.getMsalConfig(microsoftGraphConfig);
  }

  public getMsalClient() {
    return new msal.ConfidentialClientApplication(this.msalConfig);
  }

  /**
   * Configuration object to be passed to MSAL instance on creation.
   */
  private getMsalConfig(msIdentity: MicrosoftGraphConfig): msal.Configuration {
    return {
      auth: {
        clientId: msIdentity.clientId,
        authority: msIdentity.cloudInstance + msIdentity.tenantId,
        clientSecret: msIdentity.clientSecret
      },
      system: {
        loggerOptions: {
          loggerCallback(loglevel, message) {
            this.logger.info(message);
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

  public getAuthority() {
    return 'https://login.microsoftonline.com/common';
  }

  public getTokensByCode(msalClient: msal.ConfidentialClientApplication, code: string) {
    const tokenRequest = {
      code,
      redirectUri: this.redirectUri,
      scopes: this.getScopes(),
      authority: this.getAuthority()
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
      userId: null
    };

    const refreshToken = this.getRefreshTokenFromResponse(msalClient);
    if (refreshToken) {
      data.refreshToken = refreshToken;
    }

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

  private getRefreshTokenFromResponse(msalClient: msal.ConfidentialClientApplication) {
    try {
      const tokenCache = msalClient.getTokenCache().serialize();
      const refreshTokenObject = JSON.parse(tokenCache).RefreshToken;
      return refreshTokenObject[Object.keys(refreshTokenObject)[0]].secret;
    } catch (err) {
      return null;
    }
  }

  public getTokensFromDB(userId: number) {
    return this.microsoftIntegrationsRepository.findOne({ where: { userId } });
  }

  public async refreshTokens(userId: number) {
    const tokens = await this.getTokensFromDB(userId);
    if (!tokens) {
      throw new Error('No tokens found!');
    }

    const tokenRequest: msal.RefreshTokenRequest = {
      refreshToken: tokens.refreshToken,
      scopes: this.getScopes(),
      authority: this.getAuthority()
    };

    const msalClient = this.getMsalClient();
    const authResponse = await msalClient.acquireTokenByRefreshToken(tokenRequest);
    return this.saveTokens(authResponse, msalClient);
  }
}
