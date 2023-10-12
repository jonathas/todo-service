import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lists } from './lists.entity';
import { ListsResolver } from './lists.resolver';
import { ListsService } from './lists.service';
import { TasksModule } from '../tasks/tasks.module';
import { Tasks } from '../tasks/tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lists, Tasks]), forwardRef(() => TasksModule)],
  providers: [ListsResolver, ListsService],
  exports: [ListsService]
})
export class ListsModule {}
