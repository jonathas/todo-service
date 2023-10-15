import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lists } from './lists.entity';
import { ListsResolver } from './lists.resolver';
import { ListsService } from './lists.service';
import { TasksModule } from '../tasks/tasks.module';
import { Tasks } from '../tasks/tasks.entity';
import { MicrosoftTodoModule } from '../integrations/microsoft-todo/microsoft-todo.module';
import { UsersModule } from '../users/users.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lists, Tasks]),
    forwardRef(() => TasksModule),
    MicrosoftTodoModule,
    UsersModule,
    LoggerModule
  ],
  providers: [ListsResolver, ListsService],
  exports: [ListsService]
})
export class ListsModule {}
