import { Module, forwardRef } from '@nestjs/common';
import { Tasks } from './entities/tasks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';
import { TasksLists } from './entities/tasks-lists.entity';
import { ListsModule } from '../lists/lists.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tasks, TasksLists]), forwardRef(() => ListsModule)],
  providers: [TasksResolver, TasksService],
  exports: [TasksService]
})
export class TasksModule {}
