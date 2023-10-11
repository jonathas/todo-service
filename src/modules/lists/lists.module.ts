import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lists } from './lists.entity';
import { ListsResolver } from './lists.resolver';
import { ListsService } from './lists.service';
import { TasksLists } from '../tasks/entities/tasks-lists.entity';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lists, TasksLists]), forwardRef(() => TasksModule)],
  providers: [ListsResolver, ListsService],
  exports: [ListsService]
})
export class ListsModule {}
