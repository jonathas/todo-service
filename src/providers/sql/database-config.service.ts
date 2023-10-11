import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DatabaseConfig } from '../../config/database.config';
import { Environments } from '../../shared/enums';
import { SqlLoggerService } from './sql-logger/sql-logger.service';
import * as fs from 'fs';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  public constructor(
    private readonly config: ConfigService,
    private readonly sqlLogger: SqlLoggerService
  ) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseSetting: TypeOrmModuleOptions = {
      type: 'postgres',
      ...this.config.get<DatabaseConfig>('database'),
      entities: [this.getEntitiesPath()],
      logger: this.sqlLogger,
      maxQueryExecutionTime: 2000
    };

    if (databaseSetting.synchronize) {
      throw new InternalServerErrorException('Synchronize setting is not allowed');
    }

    return databaseSetting;
  }

  private getEntitiesPath(): string {
    const env = this.getEnvironment();
    const paths = {
      ts: 'src/**/*.entity.ts',
      js: 'dist/**/*.entity.js'
    };

    if (env === Environments.TEST && fs.existsSync('src')) {
      return paths.ts;
    }
    return paths.js;
  }

  private getEnvironment(): Environments {
    return Object.values(Environments).includes(process.env.NODE_ENV as Environments)
      ? (process.env.NODE_ENV as Environments)
      : Environments.DEVELOPMENT;
  }
}
