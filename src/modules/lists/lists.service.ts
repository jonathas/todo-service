import { Injectable } from '@nestjs/common';
import { Lists } from './lists.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksLists } from '../tasks/entities/tasks-lists.entity';

@Injectable()
export class ListsService {
  public constructor(
    @InjectRepository(Lists)
    private readonly listsRepository: Repository<Lists>,
    @InjectRepository(TasksLists)
    private readonly tasksListsRepository: Repository<TasksLists>
  ) {}

  public findAll(): Promise<Lists[]> {
    return this.listsRepository.find();
  }

  public async findAllByTaskId(taskId: number): Promise<Lists[]> {
    const taskLists = await this.tasksListsRepository
      .createQueryBuilder('tasksLists')
      .select([
        'tasksLists.listId',
        'list.id',
        'list.name',
        'list.description',
        'list.createdAt',
        'list.updatedAt'
      ])
      .leftJoin('tasksLists.list', 'list')
      .where('tasksLists.taskId = :taskId', { taskId })
      .getMany();

    return taskLists.map((taskList) => taskList.list);
  }
}
