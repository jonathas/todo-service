import { Injectable } from '@nestjs/common';
import { Tasks } from './entities/tasks.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  public constructor(
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>
  ) {}
}
