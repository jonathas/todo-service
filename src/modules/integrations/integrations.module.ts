import { Module } from '@nestjs/common';
import { MicrosoftTodoModule } from './microsoft-todo/microsoft-todo.module';
import { SyncModule } from './sync/sync.module';

@Module({
  imports: [SyncModule, MicrosoftTodoModule]
})
export class IntegrationsModule {}
