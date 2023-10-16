import { Injectable, NotFoundException } from '@nestjs/common';
import { Tasks } from './tasks.entity';
import { PaginatedTasks } from './dto/task.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskInput, TaskInput, UpdateTaskInput } from './dto/tasks.input';
import { MicrosoftTodoService } from '../integrations/microsoft-todo/microsoft-todo.service';
import { ListsService } from '../lists/lists.service';

@Injectable()
export class TasksService {
  public constructor(
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>,
    private readonly listsService: ListsService,
    private readonly microsoftTodoService: MicrosoftTodoService
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

  public async findOne(id: number): Promise<Tasks> {
    const task = await this.tasksRepository.findOne({ where: { id }, relations: ['list'] });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  public async create(input: CreateTaskInput): Promise<Tasks> {
    const list = await this.listsService.findOne(input.listId);

    let extListId = list?.extId;
    if (!list?.extId) {
      extListId = (await this.listsService.update({ id: list.id, name: list.name })).extId;
    }

    const task = await this.microsoftTodoService.createTask(extListId, input.name);
    return this.tasksRepository.save(
      this.tasksRepository.create(Object.assign(input, { extId: task.id }))
    );
  }

  public async update(input: UpdateTaskInput): Promise<Tasks> {
    const task = await this.findOne(input.id);
    const { list } = task;
    task.updatedAt = new Date();

    let extListId = list?.extId;
    if (!list?.extId) {
      extListId = (await this.listsService.update({ id: list.id, name: list.name })).extId;
    }

    let extId = task?.extId;
    if (!task?.extId) {
      extId = (await this.microsoftTodoService.createTask(extListId, input.name))?.id;
    }

    return this.tasksRepository.save(Object.assign(task, input, { extId }));
  }

  public async delete(id: number): Promise<Tasks> {
    const task = await this.findOne(id);
    const { list } = task;

    if (list.extId && task.extId) {
      await this.microsoftTodoService.deleteTask(list.extId, task.extId);
    }

    await this.tasksRepository.remove(task);

    return task;
  }
}
