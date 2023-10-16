import { Body, Controller, Get, Post, Redirect } from '@nestjs/common';
import * as msal from '@azure/msal-node';
import { ConfigService } from '@nestjs/config';
import { MicrosoftGraphConfig } from '../../../../config/microsoft-graph.config';
import { MSIdentityService } from './ms-identity.service';

@Controller('microsoft/auth')
export class MSIdentityController {
  private redirectUri: string;

  private postLogoutRedirectUri: string;

  public constructor(private config: ConfigService, private msIdentityService: MSIdentityService) {
    const microsoftGraphConfig = this.config.get<MicrosoftGraphConfig>('microsoftGraph');
    this.redirectUri = microsoftGraphConfig.redirectUri;
    this.postLogoutRedirectUri = microsoftGraphConfig.postLogoutRedirectUri;
  }

  @Get('signin')
  @Redirect()
  public async getAuthUrl() {
    const msalClient = this.msIdentityService.getMsalClient();

    const authCodeUrlRequest = {
      redirectUri: `${this.redirectUri}`,
      responseMode: msal.ResponseMode.FORM_POST,
      scopes: this.msIdentityService.getScopes(),
      authority: this.msIdentityService.getAuthority()
    };

    return {
      url: await msalClient.getAuthCodeUrl(authCodeUrlRequest)
    };
  }

  @Post('redirect')
  public async receiveRedirectCode(@Body() body: { code: string }) {
    const { code } = body;
    const msalClient = this.msIdentityService.getMsalClient();

    const authResponse = await this.msIdentityService.getTokensByCode(msalClient, code);
    await this.msIdentityService.saveTokens(authResponse, msalClient);
    return { success: true, message: 'Tokens saved' };
  }

  @Get('signout')
  @Redirect()
  public getSingoutUrl() {
    return {
      url:
        this.msIdentityService.getAuthority() +
        '/oauth2/v2.0/logout?post_logout_redirect_uri=' +
        this.postLogoutRedirectUri
    };
  }
}
