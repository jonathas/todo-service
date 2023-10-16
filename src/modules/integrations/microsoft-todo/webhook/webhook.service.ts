import { Injectable } from '@nestjs/common';
import { WebhookNotificationItem } from '../dto/microsoft-todo.output';
import { TasksService } from '../../../tasks/tasks.service';
import { LoggerService } from '../../../../providers/logger/logger.service';
import { WebhookChangeType } from '../microsoft-todo.types';
import { ListsService } from '../../../lists/lists.service';

@Injectable()
export class WebhookService {
  public constructor(
    private tasksService: TasksService,
    private listsService: ListsService,
    private logger: LoggerService
  ) {
    this.logger.setContext(WebhookService.name);
  }

  public handleRequest(notificationItem: WebhookNotificationItem) {
    const { resourceData, resource, changeType, subscriptionId } = notificationItem;

    if (changeType === WebhookChangeType.DELETED) {
      this.logger.info(`Deleting task with extId: ${resourceData.id}`);
      return this.tasksService.deleteByExtId(resourceData.id);
    }

    if ([WebhookChangeType.CREATED, WebhookChangeType.UPDATED].includes(changeType)) {
      const listId = this.getListId(resource);

      if (changeType === WebhookChangeType.CREATED) {
        return this.createTask(listId, subscriptionId, resourceData.id);
      }

      return this.updateTask(listId, subscriptionId, resourceData.id);
    }

    this.logger.error(`Unknown changeType: ${changeType}`);
    return null;

    // TODO: Handle list update (when it's renamed)
    // TODO: Handle list deletion (when it includes tasks and when it's empty)

    // TODO: Add GraphQL Subscription to inform the client-side when changes are done via Webhook
  }

  private getListId(resource: string) {
    const match = resource.match(/\/lists\('([^']+)'\)/);

    if (match && match.length >= 2) {
      return match[1];
    }

    this.logger.error(`Could not find list ID in resource: ${resource}`);
    return null;
  }

  private async createTask(listId: string, subscriptionId: string, taskId: string) {
    const taskFromDB = await this.tasksService.findOneByExtId(taskId);
    if (taskFromDB) {
      this.logger.error(`Task already exists in DB with extId: ${taskId}`);
      return null;
    }

    this.logger.info(`Creating task with extId: ${taskId}`);

    const listFromDB = await this.createList(listId, subscriptionId);

    return this.tasksService.createFromExtId(listFromDB.id, listId, taskId);
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
    return this.tasksService.updateFromExtId(taskFromDB, listId, taskId);
  }
}
