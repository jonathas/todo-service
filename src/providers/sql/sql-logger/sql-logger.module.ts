import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../../logger/logger.module';
import { SqlLoggerService } from './sql-logger.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [SqlLoggerService],
  exports: [SqlLoggerService]
})
export class SqlLoggerModule {}
