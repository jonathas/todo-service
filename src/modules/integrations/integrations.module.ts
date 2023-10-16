import { Module } from '@nestjs/common';
import { MicrosoftTodoModule } from './microsoft-todo/microsoft-todo.module';
import { SyncModule } from './sync/sync.module';

@Module({
  imports: [MicrosoftTodoModule, SyncModule]
})
export class IntegrationsModule {}
