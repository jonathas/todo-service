import { Body, Controller, Get, Post, Redirect, Render } from '@nestjs/common';
import * as msal from '@azure/msal-node';
import { ConfigService } from '@nestjs/config';
import { MicrosoftIdentityConfig } from '../../../config/microsoft-identity.config';

@Controller('microsoft/auth')
export class MSIdentityController {
  private redirectUri: string;

  private postLogoutRedirectUri: string;

  private msalConfig: msal.Configuration;

  public constructor(private config: ConfigService) {
    const microsoftIdentityConfig = this.config.get<MicrosoftIdentityConfig>('microsoftIdentity');
    this.redirectUri = microsoftIdentityConfig.redirectUri;
    this.postLogoutRedirectUri = microsoftIdentityConfig.postLogoutRedirectUri;

    this.msalConfig = this.getMsalConfig(microsoftIdentityConfig);
  }

  /**
   * Configuration object to be passed to MSAL instance on creation.
   */
  private getMsalConfig(msIdentity: MicrosoftIdentityConfig): msal.Configuration {
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

  @Get()
  @Render('index')
  public async root() {
    return {
      title: 'Microsoft Identity authentication',
      signInUrl: await this.getAuthUrl()
    };
  }

  @Get('signin')
  public getAuthUrl() {
    const msalClient = new msal.ConfidentialClientApplication(this.msalConfig);

    const authCodeUrlRequest = {
      redirectUri: `${this.redirectUri}`,
      responseMode: msal.ResponseMode.FORM_POST,
      scopes: []
    };

    return msalClient.getAuthCodeUrl(authCodeUrlRequest);
  }

  @Post('redirect')
  @Render('token')
  public async receiveRedirectCode(@Body() body: { code: string }) {
    const { code } = body;

    const { accessToken, idToken, tokenType, expiresOn } = await this.getTokensByCode(code);
    return { accessToken, idToken, tokenType, expiresOn };
  }

  private getTokensByCode(code: string) {
    const msalClient = new msal.ConfidentialClientApplication(this.msalConfig);

    const tokenRequest = {
      code,
      redirectUri: this.redirectUri,
      scopes: []
    };

    return msalClient.acquireTokenByCode(tokenRequest);
  }

  @Get('signout')
  @Redirect()
  public getSingoutUrl() {
    return {
      url:
        this.msalConfig.auth.authority +
        '/oauth2/v2.0/logout?post_logout_redirect_uri=' +
        this.postLogoutRedirectUri
    };
  }
}
