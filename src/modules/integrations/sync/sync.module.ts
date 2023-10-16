import { Module } from '@nestjs/common';
import { MicrosoftTodoModule } from '../microsoft-todo/microsoft-todo.module';
import { SyncResolver } from './sync.resolver';
import { SyncService } from './sync.service';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [MicrosoftTodoModule],
  controllers: [WebhookController],
  providers: [SyncResolver, SyncService]
})
export class SyncModule {}
