import { registerAs } from '@nestjs/config';

export interface GeneralConfig {
  logLevel: string;
  environment: string;
}

export default registerAs(
  'general',
  (): GeneralConfig => ({
    environment: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'debug'
  })
);
