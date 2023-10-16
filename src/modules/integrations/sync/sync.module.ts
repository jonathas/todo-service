import { Module } from '@nestjs/common';
import { MicrosoftTodoModule } from '../microsoft-todo/microsoft-todo.module';
import { SyncResolver } from './sync.resolver';
import { SyncService } from './sync.service';

@Module({
  imports: [MicrosoftTodoModule],
  providers: [SyncResolver, SyncService]
})
export class SyncModule {}
