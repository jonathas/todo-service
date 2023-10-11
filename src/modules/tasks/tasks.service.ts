import { Injectable } from '@nestjs/common';
import { Tasks } from './entities/tasks.entity';
import { PaginatedTasks } from './dto/task.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  public constructor(
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>
  ) {}

  public async findAll(): Promise<PaginatedTasks> {
    const [data, totalCount] = await this.tasksRepository.findAndCount();
    return { data, totalCount };
  }

  public findOne(id: number): Promise<Tasks> {
    return this.tasksRepository.findOne({ where: { id } });
  }

  public create(task: Tasks): Promise<Tasks> {
    return this.tasksRepository.save(task);
  }

  public async update(id: number, task: Tasks): Promise<Tasks> {
    await this.tasksRepository.update(id, task);
    return this.tasksRepository.findOne({ where: { id } });
  }

  public async delete(id: string): Promise<void> {
    await this.tasksRepository.delete(id);
  }
}
