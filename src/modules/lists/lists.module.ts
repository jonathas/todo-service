import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lists } from './lists.entity';
import { ListsResolver } from './lists.resolver';
import { ListsService } from './lists.service';
import { TasksLists } from '../tasks/entities/tasks-lists.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lists, TasksLists])],
  providers: [ListsResolver, ListsService],
  exports: [ListsService]
})
export class ListsModule {}
