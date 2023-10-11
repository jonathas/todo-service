import { Module } from '@nestjs/common';
import { Tasks } from './entities/tasks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';
import { TasksLists } from './entities/tasks-lists.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tasks, TasksLists])],
  providers: [TasksResolver, TasksService]
})
export class TasksModule {}
