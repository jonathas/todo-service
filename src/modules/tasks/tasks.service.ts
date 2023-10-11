import { Injectable, NotFoundException } from '@nestjs/common';
import { Tasks } from './entities/tasks.entity';
import { PaginatedTasks, Task } from './dto/task.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskInput, TaskInput, UpdateTaskInput } from './dto/tasks.input';

@Injectable()
export class TasksService {
  public constructor(
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>
  ) {}

  public async findAll(input: TaskInput): Promise<PaginatedTasks> {
    const { isDone, order, sortBy, limit, offset } = input;

    const [data, totalCount] = await this.tasksRepository.findAndCount({
      where: { isDone },
      order: { [sortBy]: order },
      take: limit,
      skip: offset
    });

    return { data, totalCount };
  }

  public async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  public create(input: CreateTaskInput): Promise<Tasks> {
    const task = this.tasksRepository.create(input);
    return this.tasksRepository.save(task);
  }

  public async update(input: UpdateTaskInput): Promise<Tasks> {
    const task = await this.findOne(input.id);
    task.updatedAt = new Date();

    return this.tasksRepository.save(Object.assign(task, input));
  }

  public async delete(id: number): Promise<Task> {
    const task = await this.findOne(id);
    await this.tasksRepository.delete(task);
    return task;
  }
}
