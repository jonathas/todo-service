import { Injectable, NotFoundException } from '@nestjs/common';
import { Lists } from './lists.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { List, PaginatedLists } from './dto/list.dto';
import { CreateListInput, ListInput, UpdateListInput } from './dto/lists.input';
import { Tasks } from '../tasks/tasks.entity';

@Injectable()
export class ListsService {
  public constructor(
    @InjectRepository(Lists)
    private readonly listsRepository: Repository<Lists>,
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>
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

  public async findOne(id: number): Promise<List> {
    const list = await this.listsRepository.findOne({ where: { id } });
    if (!list) {
      throw new NotFoundException('List not found');
    }
    return list;
  }

  public create(input: CreateListInput): Promise<Lists> {
    return this.listsRepository.save(this.listsRepository.create(input));
  }

  public async update(input: UpdateListInput): Promise<Lists> {
    const list = await this.findOne(input.id);
    list.updatedAt = new Date();

    return this.listsRepository.save(Object.assign(list, input));
  }

  public async delete(id: number): Promise<List> {
    const list = await this.findOne(id);
    const tasks = await this.tasksRepository.find({
      where: { listId: list.id }
    });

    await this.tasksRepository.remove(tasks);
    await this.listsRepository.delete(list);

    return list;
  }
}
