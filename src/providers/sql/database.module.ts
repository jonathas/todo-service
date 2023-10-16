import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfigService } from './database-config.service';
import { DataSource } from 'typeorm';
import { SqlLoggerService } from './sql-logger/sql-logger.service';
import { SqlLoggerModule } from './sql-logger/sql-logger.module';
import { LoggerModule } from '../logger/logger.module';
import { DateScalar } from '../../shared/decorators/date.decorator';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    SqlLoggerModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, SqlLoggerModule],
      inject: [ConfigService, SqlLoggerService],
      useClass: DatabaseConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        return dataSource;
      }
    })
  ],
  providers: [DateScalar, DatabaseConfigService]
})
export class DatabaseModule {}
