import { registerAs } from '@nestjs/config';

export interface GeneralConfig {
  logLevel: string;
  environment: string;
  httpRetriesCount: number;
  httpRetriesDelay: number;
}

export default registerAs(
  'general',
  (): GeneralConfig => ({
    environment: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'debug',
    httpRetriesCount: parseInt(process.env.HTTP_RETRIES_COUNT) || 3,
    httpRetriesDelay: parseInt(process.env.HTTP_RETRIES_DELAY) || 1000
  })
);
