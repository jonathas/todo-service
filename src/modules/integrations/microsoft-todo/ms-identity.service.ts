import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MicrosoftIntegrations } from './microsoft-integrations.entity';
import { Repository } from 'typeorm';
import * as msal from '@azure/msal-node';
import { MicrosoftIdentityConfig } from '../../../config/microsoft-identity.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MSIdentityService {
  private redirectUri: string;

  public constructor(
    private config: ConfigService,
    @InjectRepository(MicrosoftIntegrations)
    private readonly microsoftIntegrationsRepository: Repository<MicrosoftIntegrations>
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
      scopes: this.getScopes()
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
      username,
      refreshToken: this.getRefreshToken(msalClient)
    };

    const userTokens = await this.microsoftIntegrationsRepository.findOne({ where: { username } });
    if (userTokens) {
      data.id = userTokens.id;
    }

    return this.microsoftIntegrationsRepository.save(
      this.microsoftIntegrationsRepository.create(data)
    );
  }

  private getRefreshToken(msalClient: msal.ConfidentialClientApplication) {
    const tokenCache = msalClient.getTokenCache().serialize();
    const refreshTokenObject = JSON.parse(tokenCache).RefreshToken;
    return refreshTokenObject[Object.keys(refreshTokenObject)[0]].secret;
  }
}
