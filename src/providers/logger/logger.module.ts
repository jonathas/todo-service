import { Global, Module } from '@nestjs/common';
import { LoggerModule as PinoModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GeneralConfig } from '../../config/general.config';
import { Environments } from '../../shared/enums';
import { LoggerService } from './logger.service';

@Global()
@Module({
  imports: [
    PinoModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { logLevel, environment } = configService.get<GeneralConfig>('general');
        return {
          pinoHttp: {
            autoLogging: false,
            formatters: {
              level: (label: string) => {
                return { level: label };
              }
            },
            level: logLevel || 'debug',
            transport:
              environment === Environments.DEVELOPMENT ? { target: 'pino-pretty' } : undefined
          }
        };
      }
    })
  ],
  providers: [LoggerService],
  exports: [LoggerService]
})
export class LoggerModule {}
