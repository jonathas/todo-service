import { Module } from '@nestjs/common';
import { Tasks } from './tasks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tasks])],
  providers: [TasksResolver, TasksService]
})
export class TasksModule {}
