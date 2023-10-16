import { Injectable } from '@nestjs/common';
import { MicrosoftTodoService } from '../microsoft-todo/microsoft-todo.service';
import { TasksService } from '../../tasks/tasks.service';
import { ListsService } from '../../lists/lists.service';
import { Tasks } from '../../tasks/tasks.entity';
import { LoggerService } from '../../../providers/logger/logger.service';
import { ListOutput } from '../microsoft-todo/dto/microsoft-todo.output';

@Injectable()
export class SyncService {
  public constructor(
    private microsoftTodoService: MicrosoftTodoService,
    private tasksService: TasksService,
    private listsService: ListsService,
    private logger: LoggerService
  ) {
    this.logger.setContext(SyncService.name);
  }

  public async sync() {
    await this.syncLists();
    await this.syncTasks();
  }

  private async syncLists() {
    const listsFromDB = await this.listsService.findAllLists();
    const listsFromAPI = (await this.microsoftTodoService.getLists())?.value;

    if (!listsFromDB.length && !listsFromAPI.length) {
      this.logger.info('No lists found in DB and in the API. Nothing to sync.');
      return;
    }

    const listsFromAPIWithNoExtIdInDB = listsFromAPI.filter(
      (listAPI) => !listsFromDB.find((listDB) => listDB.extId === listAPI.id)
    );

    // Not found via extId, not found via name. Create them.
    const listsToCreate = listsFromAPIWithNoExtIdInDB.filter(
      (list) => !listsFromDB.find((listDB) => listDB.name === list.displayName)
    );
    await Promise.all(
      listsToCreate.map((list) => this.listsService.createFromExistingInTheAPI(list))
    );

    // Not found via extId, but found via name. Update them by setting the extId and subscribing.
    const listsToUpdate = listsFromAPIWithNoExtIdInDB.filter((list) =>
      listsFromDB.find((listDB) => listDB.name === list.displayName)
    );
    await Promise.all(
      listsToUpdate.map((list) => this.listsService.updateFromExistingInTheAPI(list))
    );

    // Not in the API anymore, but still in the DB. Delete them.
    const listsToDelete = listsFromDB.filter(
      (listDB) =>
        listDB.extId !== '' && !listsFromAPI.find((listAPI) => listAPI.id === listDB.extId)
    );
    for (const listDelete of listsToDelete) {
      await this.listsService.delete(listDelete.id);
    }
  }

  private async syncTasks() {
    const tasksFromDB = await this.tasksService.findAllTasks();

    const listsFromAPI = (await this.microsoftTodoService.getLists())?.value;

    if (!tasksFromDB.length && !listsFromAPI.length) {
      this.logger.info('No tasks found in DB and in the API. Nothing to sync.');
      return;
    }

    for (const listAPI of listsFromAPI) {
      await this.downloadTasksFromList(listAPI, tasksFromDB);
    }
  }

  private async downloadTasksFromList(listAPI: ListOutput, tasksFromDB: Tasks[]) {
    const tasksFromAPI = (await this.microsoftTodoService.getTasksFromList(listAPI.id))?.value;

    const tasksFromAPIWithNoExtIdInDB = tasksFromAPI.filter(
      (taskAPI) => !tasksFromDB.find((taskDB) => taskDB.extId === taskAPI.id)
    );

    // Not found via extId, not found via name. Create them.
    const tasksToCreate = tasksFromAPIWithNoExtIdInDB.filter(
      (task) => !tasksFromDB.find((listDB) => listDB.name === task.title)
    );
    await Promise.all(
      tasksToCreate.map((task) => this.tasksService.createFromExistingInTheAPI(task, listAPI))
    );

    // Not found via extId, but found via name. Update them by setting the extId.
    const tasksToUpdate = tasksFromAPIWithNoExtIdInDB.filter((task) =>
      tasksFromDB.find((taskDB) => taskDB.name === task.title)
    );
    await Promise.all(
      tasksToUpdate.map((task) => this.tasksService.updateFromExistingInTheAPI(task, listAPI))
    );

    // Not in the API anymore, but still in the DB. Delete them.
    const tasksToDelete = tasksFromDB.filter(
      (taskDB) =>
        taskDB.extId !== '' && !tasksFromAPI.find((taskAPI) => taskAPI.id === taskDB.extId)
    );
    for (const taskDelete of tasksToDelete) {
      await this.tasksService.delete(taskDelete.id);
    }
  }
}
