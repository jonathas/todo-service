import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { DatabaseModule } from './providers/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      cache: true
    }),
    DatabaseModule
  ],
  providers: []
})
export class AppModule {}
