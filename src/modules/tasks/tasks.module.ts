import { Module, forwardRef } from '@nestjs/common';
import { Tasks } from './tasks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';
import { ListsModule } from '../lists/lists.module';
import { MicrosoftTodoModule } from '../integrations/microsoft-todo/microsoft-todo.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tasks]),
    forwardRef(() => ListsModule),
    MicrosoftTodoModule,
    LoggerModule
  ],
  providers: [TasksResolver, TasksService],
  exports: [TasksService]
})
export class TasksModule {}
