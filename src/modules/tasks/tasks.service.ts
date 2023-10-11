import { Injectable } from '@nestjs/common';
import { Tasks } from './entities/tasks.entity';
import { PaginatedTasks } from './dto/task.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskInput } from './dto/tasks.input';

@Injectable()
export class TasksService {
  public constructor(
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>
  ) {}

  public async findAll(input: TaskInput): Promise<PaginatedTasks> {
    const { order, sortBy, limit, offset } = input;

    const [data, totalCount] = await this.tasksRepository.findAndCount({
      order: { [sortBy]: order },
      take: limit,
      skip: offset
    });

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
