import { Module, forwardRef } from '@nestjs/common';
import { Tasks } from './tasks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';
import { ListsModule } from '../lists/lists.module';
import { MicrosoftTodoModule } from '../integrations/microsoft-todo/microsoft-todo.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tasks]), forwardRef(() => ListsModule), MicrosoftTodoModule],
  providers: [TasksResolver, TasksService],
  exports: [TasksService]
})
export class TasksModule {}
