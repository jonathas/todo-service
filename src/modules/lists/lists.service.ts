import { Injectable, NotFoundException } from '@nestjs/common';
import { Lists } from './lists.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { List, PaginatedLists } from './dto/list.dto';
import { CreateListInput, ListInput, UpdateListInput } from './dto/lists.input';
import { Tasks } from '../tasks/tasks.entity';
import { MicrosoftTodoService } from '../integrations/microsoft-todo/microsoft-todo.service';
import { ConfigService } from '@nestjs/config';
import { MicrosoftGraphConfig } from '../../config/microsoft-graph.config';
import { SubscriptionsService } from '../integrations/microsoft-todo/subscriptions/subscriptions.service';

@Injectable()
export class ListsService {
  private microsoftGraphConfig: MicrosoftGraphConfig;

  public constructor(
    @InjectRepository(Lists)
    private readonly listsRepository: Repository<Lists>,
    @InjectRepository(Tasks)
    private readonly tasksRepository: Repository<Tasks>,
    private readonly microsoftTodoService: MicrosoftTodoService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly config: ConfigService
  ) {
    this.microsoftGraphConfig = this.config.get<MicrosoftGraphConfig>('microsoftGraph');
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

  public async findOne(id: number): Promise<Lists> {
    const list = await this.listsRepository.findOne({ where: { id } });
    if (!list) {
      throw new NotFoundException('List not found');
    }
    return list;
  }

  public findOneByExtId(extId: string): Promise<Lists> {
    return this.listsRepository.findOne({ where: { extId } });
  }

  public async create(input: CreateListInput): Promise<Lists> {
    const extId = (await this.microsoftTodoService.createList(input.name))?.id;
    const extSubscriptionId = await this.createListSubscription(extId);

    return this.listsRepository.save(
      this.listsRepository.create(Object.assign(input, { extId, extSubscriptionId }))
    );
  }

  private async createListSubscription(extId: string) {
    const { useWebhook, webhookUrl } = this.microsoftGraphConfig;
    let extSubscriptionId = '';
    if (useWebhook && webhookUrl) {
      const subResponse = await this.microsoftTodoService.subscribe([extId], webhookUrl);
      extSubscriptionId = subResponse[0].id;
      await this.subscriptionsService.create(subResponse[0]);
    }

    return extSubscriptionId;
  }

  public async createFromExtId(extId: string, extSubscriptionId: string): Promise<Lists> {
    const list = await this.microsoftTodoService.getList(extId);

    const listInput: Partial<Lists> = {
      name: list.displayName,
      extId,
      extSubscriptionId,
      lastSyncedAt: new Date()
    };

    const subscriptionFromDB = await this.subscriptionsService.findOneBySubscriptionId(
      extSubscriptionId
    );
    if (!subscriptionFromDB) {
      const subscription = await this.microsoftTodoService.getSubscription(extSubscriptionId);
      await this.subscriptionsService.create(subscription);
    }

    return this.listsRepository.save(this.listsRepository.create(listInput));
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

      if (list?.extSubscriptionId) {
        await this.microsoftTodoService.unsubscribe([list.extSubscriptionId]);
        const subscription = await this.subscriptionsService.findOneBySubscriptionId(
          list.extSubscriptionId
        );
        await this.subscriptionsService.delete([subscription]);
      }
    }

    await this.tasksRepository.delete({ listId: list.id });
    await this.listsRepository.remove(list);

    return list;
  }
}
