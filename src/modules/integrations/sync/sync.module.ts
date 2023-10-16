import { Module } from '@nestjs/common';
import { MicrosoftTodoModule } from '../microsoft-todo/microsoft-todo.module';
import { SyncResolver } from './sync.resolver';
import { SyncService } from './sync.service';
import { ListsModule } from '../../lists/lists.module';
import { TasksModule } from '../../tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MicrosoftTodoModule, ListsModule, TasksModule, ConfigModule],
  providers: [SyncResolver, SyncService]
})
export class SyncModule {}
