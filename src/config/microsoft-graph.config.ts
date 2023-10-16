import { registerAs } from '@nestjs/config';

export interface MicrosoftGraphConfig {
  cloudInstance: string;
  tenantId: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
  graphApiEndpoint: string;
  useWebhook: boolean;
  webhookUrl: string;
}

export default registerAs(
  'microsoftGraph',
  (): MicrosoftGraphConfig => ({
    cloudInstance: process.env.MICROSOFT_IDENTITY_CLOUD_INSTANCE,
    tenantId: process.env.MICROSOFT_IDENTITY_TENANT_ID,
    clientId: process.env.MICROSOFT_IDENTITY_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_IDENTITY_CLIENT_SECRET,
    redirectUri: process.env.MICROSOFT_IDENTITY_REDIRECT_URI,
    postLogoutRedirectUri: process.env.MICROSOFT_IDENTITY_POST_LOGOUT_REDIRECT_URI,
    graphApiEndpoint: process.env.MICROSOFT_IDENTITY_GRAPH_API_ENDPOINT,
    useWebhook: process.env.MICROSOFT_IDENTITY_USE_WEBHOOK === 'true',
    webhookUrl: process.env.MICROSOFT_IDENTITY_WEBHOOK_URL
  })
);
