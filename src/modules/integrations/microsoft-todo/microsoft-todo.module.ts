import { Module, forwardRef } from '@nestjs/common';
import { MSIdentityController } from './ms-identity/ms-identity.controller';
import { ConfigModule } from '@nestjs/config';
import { MicrosoftIntegrations } from './microsoft-integrations.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MSIdentityService } from './ms-identity/ms-identity.service';
import { MicrosoftTodoService } from './microsoft-todo.service';
import { UsersModule } from '../../users/users.module';
import { WebhookController } from './webhook/webhook.controller';
import { Subscriptions } from './subscriptions/subscriptions.entity';
import { SubscriptionsService } from './subscriptions/subscriptions.service';
import { WebhookService } from './webhook/webhook.service';
import { TasksModule } from '../../tasks/tasks.module';
import { ListsModule } from '../../lists/lists.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MicrosoftIntegrations, Subscriptions]),
    ConfigModule,
    forwardRef(() => ListsModule),
    forwardRef(() => TasksModule),
    UsersModule
  ],
  controllers: [MSIdentityController, WebhookController],
  providers: [MSIdentityService, MicrosoftTodoService, SubscriptionsService, WebhookService],
  exports: [MicrosoftTodoService, SubscriptionsService]
})
export class MicrosoftTodoModule {}
