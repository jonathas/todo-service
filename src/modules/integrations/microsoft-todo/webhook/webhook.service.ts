import { Inject, Injectable } from '@nestjs/common';
import { WebhookNotificationItem } from '../dto/microsoft-todo.output';
import { TasksService } from '../../../tasks/tasks.service';
import { LoggerService } from '../../../../providers/logger/logger.service';
import { WebhookChangeType } from '../microsoft-todo.types';
import { ListsService } from '../../../lists/lists.service';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from '../../../../providers/redis/redis-pubsub.module';

@Injectable()
export class WebhookService {
  public constructor(
    private tasksService: TasksService,
    private listsService: ListsService,
    private logger: LoggerService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub
  ) {
    this.logger.setContext(WebhookService.name);
  }

  public handleRequest(notificationItem: WebhookNotificationItem) {
    const { resourceData, resource, changeType, subscriptionId } = notificationItem;

    if (changeType === WebhookChangeType.DELETED) {
      return this.deleteTask(resourceData.id);
    }

    const listId = this.getListId(resource);

    if (changeType === WebhookChangeType.CREATED) {
      return this.createTask(listId, subscriptionId, resourceData.id);
    }

    if (changeType === WebhookChangeType.UPDATED) {
      return this.updateTask(listId, subscriptionId, resourceData.id);
    }

    this.logger.error(`Unknown changeType: ${changeType}`);
    return null;
  }

  private getListId(resource: string) {
    const match = resource.match(/\/lists\('([^']+)'\)/);

    if (match && match.length >= 2) {
      return match[1];
    }

    this.logger.error(`Could not find list ID in resource: ${resource}`);
    return null;
  }

  private async deleteTask(taskId: string) {
    this.logger.info(`Deleting task with extId: ${taskId}`);
    const task = await this.tasksService.findOneByExtId(taskId);
    await this.tasksService.deleteByExtId(task.extId);

    await this.pubSub.publish('notifications', {
      changeType: WebhookChangeType.DELETED,
      data: task
    });

    return task;
  }

  private async createTask(listId: string, subscriptionId: string, taskId: string) {
    const taskFromDB = await this.tasksService.findOneByExtId(taskId);
    if (taskFromDB) {
      this.logger.error(`Task already exists in DB with extId: ${taskId}`);
      return null;
    }

    this.logger.info(`Creating task with extId: ${taskId}`);

    const listFromDB = await this.createList(listId, subscriptionId);

    const task = await this.tasksService.createFromExtId(listFromDB.id, listId, taskId);

    await this.pubSub.publish('notifications', {
      changeType: WebhookChangeType.CREATED,
      data: task
    });

    return task;
  }

  private async createList(listId: string, subscriptionId: string) {
    let listFromDB = await this.listsService.findOneByExtId(listId);
    if (!listFromDB) {
      this.logger.error(`Could not find list in DB with extId: ${listId} - Creating it now...`);
      listFromDB = await this.listsService.createFromExtId(listId, subscriptionId);
    }

    return listFromDB;
  }

  private async updateTask(listId: string, subscriptionId: string, taskId: string) {
    const taskFromDB = await this.tasksService.findOneByExtId(taskId);
    if (!taskFromDB) {
      this.logger.error(`Could not find task in DB with extId: ${taskId} - Creating it now...`);
      return this.createTask(listId, subscriptionId, taskId);
    }

    this.logger.info(`Making sure list exists in DB with extId: ${listId}`);
    await this.createList(listId, subscriptionId);

    this.logger.info(`Updating task with extId: ${taskId}`);
    const task = await this.tasksService.updateFromExtId(taskFromDB, listId, taskId);

    await this.pubSub.publish('notifications', {
      changeType: WebhookChangeType.UPDATED,
      data: task
    });

    return task;
  }
}
