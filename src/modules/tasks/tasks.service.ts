import { Injectable, NotFoundException } from '@nestjs/common';
import { Tasks } from './entities/tasks.entity';
import { PaginatedTasks, Task } from './dto/task.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskInput, TaskInput, UpdateTaskInput } from './dto/tasks.input';
import { TasksLists } from './entities/tasks-lists.entity';

@Injectable()
export class TasksService {
  public constructor(
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>,
    @InjectRepository(TasksLists)
    private readonly tasksListsRepository: Repository<TasksLists>
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

  public findAllByListId(listId: number): Promise<Tasks[]> {
    return this.tasksRepository
      .createQueryBuilder('tasks')
      .innerJoin('tasks.taskLists', 'taskLists')
      .innerJoin('taskLists.list', 'lists')
      .where('lists.id = :listId', { listId })
      .getMany();
  }

  public async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  public async create(input: CreateTaskInput): Promise<Tasks> {
    const task = await this.tasksRepository.save(this.tasksRepository.create(input));

    if (input?.listsIds?.length) {
      const taskLists = input.listsIds.map((listId) =>
        this.tasksListsRepository.create({ taskId: task.id, listId })
      );
      await this.tasksListsRepository.save(taskLists);
    }

    return task;
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
