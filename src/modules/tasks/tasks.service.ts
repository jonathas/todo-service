import { Injectable, NotFoundException } from '@nestjs/common';
import { Tasks } from './tasks.entity';
import { PaginatedTasks } from './dto/task.dto';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskInput, TaskInput, UpdateTaskInput } from './dto/tasks.input';
import { MicrosoftTodoService } from '../integrations/microsoft-todo/microsoft-todo.service';
import { ListsService } from '../lists/lists.service';
import {
  TaskStatus,
  UpdateMicrosoftTaskInput
} from '../integrations/microsoft-todo/microsoft-todo.types';
import { ListOutput, TaskOutput } from '../integrations/microsoft-todo/dto/microsoft-todo.output';

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

  public findAllTasks(): Promise<Tasks[]> {
    return this.tasksRepository.find();
  }

  public async findAllByListId(listId: number, input: TaskInput): Promise<PaginatedTasks> {
    const [data, totalCount] = await this.tasksRepository.findAndCount({
      where: { listId },
      order: { [input.sortBy]: input.order },
      take: input.limit,
      skip: input.offset
    });

    return { data, totalCount };
  }

  public async findOne(id: number): Promise<Tasks> {
    const task = await this.tasksRepository.findOne({ where: { id }, relations: ['list'] });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  public findOneByExtId(extId: string): Promise<Tasks> {
    return this.tasksRepository.findOne({ where: { extId } });
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

  public async createFromExtId(
    listIdFromDB: number,
    extListId: string,
    extId: string
  ): Promise<Tasks> {
    const { title, status } = await this.microsoftTodoService.getTask(extListId, extId);

    return this.tasksRepository.save(
      this.tasksRepository.create({
        name: title,
        isDone: status === TaskStatus.COMPLETED,
        listId: listIdFromDB,
        extId,
        lastSyncedAt: new Date()
      })
    );
  }

  public async createFromExistingInTheAPI(task: TaskOutput, list: ListOutput): Promise<Tasks> {
    let listFromDB = await this.listsService.findOneByExtId(list.id);
    if (!listFromDB) {
      listFromDB = await this.listsService.createFromExistingInTheAPI(list);
    }

    return this.tasksRepository.save(
      this.tasksRepository.create({
        name: task.title,
        isDone: task.status === TaskStatus.COMPLETED,
        listId: listFromDB.id,
        extId: task.id,
        lastSyncedAt: new Date()
      })
    );
  }

  public async update(input: UpdateTaskInput): Promise<Tasks> {
    const task = await this.findOne(input.id);
    task.updatedAt = new Date();

    const extId = await this.syncUpdate(task, input);

    return this.tasksRepository.save(Object.assign(task, input, { extId }));
  }

  private async syncUpdate(task: Tasks, input: UpdateTaskInput) {
    const { list } = task;

    let extListId = list?.extId;
    if (!list?.extId) {
      extListId = (await this.listsService.update({ id: list.id, name: list.name })).extId;
    }

    let extId = task?.extId;
    if (!task?.extId) {
      extId = (await this.microsoftTodoService.createTask(extListId, input.name))?.id;
      return extId;
    }

    const data: UpdateMicrosoftTaskInput = Object.assign(
      {
        listId: extListId,
        taskId: extId,
        status: input.isDone ? TaskStatus.COMPLETED : TaskStatus.NOT_STARTED
      },
      input.name ? { title: input.name } : {}
    );
    await this.microsoftTodoService.updateTask(data);

    return extId;
  }

  public async updateFromExtId(
    taskFromDB: Tasks,
    extListId: string,
    extId: string
  ): Promise<Tasks> {
    const { title, status } = await this.microsoftTodoService.getTask(extListId, extId);
    const listFromDB = await this.listsService.findOneByExtId(extListId);

    taskFromDB.name = title;
    taskFromDB.listId = listFromDB.id;
    taskFromDB.extId = extId;
    taskFromDB.lastSyncedAt = new Date();
    taskFromDB.isDone = status === TaskStatus.COMPLETED;

    return this.tasksRepository.save(taskFromDB);
  }

  public async updateFromExistingInTheAPI(task: TaskOutput, list: ListOutput): Promise<Tasks> {
    const taskFromDB = await this.tasksRepository.findOne({ where: { name: task.title } });
    let listFromDB = await this.listsService.findOneByExtId(list.id);
    if (!listFromDB) {
      listFromDB = await this.listsService.createFromExistingInTheAPI(list);
    }

    return this.tasksRepository.save(
      this.tasksRepository.create({
        id: taskFromDB.id,
        listId: listFromDB.id,
        extId: task.id,
        lastSyncedAt: new Date(),
        name: task.title,
        isDone: task.status === TaskStatus.COMPLETED
      })
    );
  }

  public async delete(id: number): Promise<Tasks> {
    const task = await this.findOne(id);
    const { list } = task;

    if (list.extId && task.extId) {
      await this.microsoftTodoService.deleteTask(list.extId, task.extId);
    }

    await this.tasksRepository.delete({ id: task.id });

    return task;
  }

  public deleteByExtId(taskId: string): Promise<DeleteResult> {
    return this.tasksRepository.delete({ extId: taskId });
  }
}
