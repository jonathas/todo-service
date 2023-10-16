import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lists } from './lists.entity';
import { ListsResolver } from './lists.resolver';
import { ListsService } from './lists.service';
import { TasksModule } from '../tasks/tasks.module';
import { Tasks } from '../tasks/tasks.entity';
import { MicrosoftTodoModule } from '../integrations/microsoft-todo/microsoft-todo.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lists, Tasks]),
    forwardRef(() => TasksModule),
    MicrosoftTodoModule,
    ConfigModule
  ],
  providers: [ListsResolver, ListsService],
  exports: [ListsService]
})
export class ListsModule {}
