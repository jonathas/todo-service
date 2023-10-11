import { Injectable } from '@nestjs/common';
import { Tasks } from './tasks.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  public constructor(
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>
  ) {}
}
