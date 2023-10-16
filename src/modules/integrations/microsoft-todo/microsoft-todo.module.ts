import { Module } from '@nestjs/common';
import { MSIdentityController } from './ms-identity/ms-identity.controller';
import { ConfigModule } from '@nestjs/config';
import { MicrosoftIntegrations } from './microsoft-integrations.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MSIdentityService } from './ms-identity/ms-identity.service';
import { MicrosoftTodoService } from './microsoft-todo.service';
import { UsersModule } from '../../users/users.module';
import { WebhookController } from './webhook.controller';
import { Subscriptions } from './subscriptions/subscriptions.entity';
import { SubscriptionsService } from './subscriptions/subscriptions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MicrosoftIntegrations, Subscriptions]),
    ConfigModule,
    UsersModule
  ],
  controllers: [MSIdentityController, WebhookController],
  providers: [MSIdentityService, MicrosoftTodoService, SubscriptionsService],
  exports: [MicrosoftTodoService, SubscriptionsService]
})
export class MicrosoftTodoModule {}
