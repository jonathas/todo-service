import { Injectable, NotFoundException } from '@nestjs/common';
import { Lists } from './lists.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { List, PaginatedLists } from './dto/list.dto';
import { CreateListInput, ListInput, UpdateListInput } from './dto/lists.input';
import { Tasks } from '../tasks/tasks.entity';
import { MicrosoftTodoService } from '../integrations/microsoft-todo/microsoft-todo.service';

@Injectable()
export class ListsService {
  public constructor(
    @InjectRepository(Lists)
    private readonly listsRepository: Repository<Lists>,
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>,
    private readonly microsoftTodoService: MicrosoftTodoService
  ) {}

  public async findAll(input: ListInput): Promise<PaginatedLists> {
    const { order, sortBy, limit, offset } = input;

    const [data, totalCount] = await this.listsRepository.findAndCount({
      order: { [sortBy]: order },
      take: limit,
      skip: offset
    });

    return { data, totalCount };
  }

  public async findOne(id: number): Promise<Lists> {
    const list = await this.listsRepository.findOne({ where: { id } });
    if (!list) {
      throw new NotFoundException('List not found');
    }
    return list;
  }

  public async create(input: CreateListInput): Promise<Lists> {
    const extId = (await this.microsoftTodoService.createList(input.name))?.id;
    return this.listsRepository.save(this.listsRepository.create(Object.assign(input, { extId })));
  }

  public async update(input: UpdateListInput): Promise<Lists> {
    const list = await this.findOne(input.id);
    list.updatedAt = new Date();

    let extId = list?.extId;
    if (!list?.extId) {
      extId = (await this.microsoftTodoService.createList(input.name))?.id;
    }

    return this.listsRepository.save(Object.assign(list, input, { extId }));
  }

  public async delete(id: number): Promise<List> {
    const list = await this.findOne(id);

    if (list.extId) {
      await this.microsoftTodoService.deleteList(list.extId);
    }

    await this.tasksRepository.delete({ listId: list.id });
    await this.listsRepository.remove(list);

    return list;
  }
}
