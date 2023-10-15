import { Module } from '@nestjs/common';
import { MSIdentityController } from './ms-identity/ms-identity.controller';
import { ConfigModule } from '@nestjs/config';
import { MicrosoftIntegrations } from './microsoft-integrations.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MSIdentityService } from './ms-identity/ms-identity.service';
import { MicrosoftTodoService } from './microsoft-todo.service';
import { UsersModule } from '../../users/users.module';
import { SyncModule } from '../sync/sync.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MicrosoftIntegrations]),
    ConfigModule,
    SyncModule,
    UsersModule
  ],
  controllers: [MSIdentityController],
  providers: [MSIdentityService, MicrosoftTodoService]
})
export class MicrosoftTodoModule {}
