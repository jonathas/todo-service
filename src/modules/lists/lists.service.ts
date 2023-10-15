import { Injectable, NotFoundException } from '@nestjs/common';
import { Lists } from './lists.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { List, PaginatedLists } from './dto/list.dto';
import { CreateListInput, ListInput, UpdateListInput } from './dto/lists.input';
import { Tasks } from '../tasks/tasks.entity';
import { MicrosoftTodoService } from '../integrations/microsoft-todo/microsoft-todo.service';
import { UsersService } from '../users/users.service';
import { LoggerService } from '../../providers/logger/logger.service';

@Injectable()
export class ListsService {
  public constructor(
    @InjectRepository(Lists)
    private readonly listsRepository: Repository<Lists>,
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>,
    private readonly dataSource: DataSource,
    private readonly microsoftTodoService: MicrosoftTodoService,
    private readonly usersService: UsersService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext(ListsService.name);
  }

  public async findAll(input: ListInput): Promise<PaginatedLists> {
    const { order, sortBy, limit, offset } = input;

    const [data, totalCount] = await this.listsRepository.findAndCount({
      order: { [sortBy]: order },
      take: limit,
      skip: offset
    });

    return { data, totalCount };
  }

  public async findOne(id: number): Promise<List> {
    const list = await this.listsRepository.findOne({ where: { id } });
    if (!list) {
      throw new NotFoundException('List not found');
    }
    return list;
  }

  public async create(input: CreateListInput): Promise<Lists> {
    // TODO: The user comes from the RequestUser object, populated in the authentication guard.
    // the method below (findLastUser) is for demo purposes only.
    const user = await this.usersService.findLastUser();

    const list = await this.listsRepository.save(this.listsRepository.create(input));
    if (!user) {
      this.logger.info('User not found in DB');
      return list;
    }

    await this.microsoftTodoService.createList(user.id, input.name);

    return list;
  }

  public async update(input: UpdateListInput): Promise<Lists> {
    const list = await this.findOne(input.id);
    list.updatedAt = new Date();

    return this.listsRepository.save(Object.assign(list, input));
  }

  public async delete(id: number): Promise<List> {
    const list = await this.findOne(id);

    await this.tasksRepository.delete({ listId: list.id });
    await this.listsRepository.delete(list);

    return list;
  }
}
