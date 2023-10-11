import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DatabaseConfig } from '../../config/database.config';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  public constructor(private readonly config: ConfigService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseSetting: TypeOrmModuleOptions = {
      type: 'postgres',
      ...this.config.get<DatabaseConfig>('database'),
      entities: [__dirname + '/../../../**/*.entity{.ts,.js}']
    };

    if (databaseSetting.synchronize) {
      throw new InternalServerErrorException('Synchronize setting is not allowed');
    }

    return databaseSetting;
  }
}
