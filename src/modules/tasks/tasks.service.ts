import { Injectable, NotFoundException } from '@nestjs/common';
import { Tasks } from './tasks.entity';
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

    const [data, totalCount] = await this.tasksRepository
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.list', 'lists')
      .where('tasks.isDone = :isDone', { isDone })
      .orderBy(`tasks.${sortBy}`, order)
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return { data, totalCount };
  }

  public findAllByListId(listId: number): Promise<Tasks[]> {
    return this.tasksRepository.find({
      where: { listId }
    });
  }

  public async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id }, relations: ['list'] });

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  public create(input: CreateTaskInput): Promise<Tasks> {
    return this.tasksRepository.save(this.tasksRepository.create(input));
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
