import { UpdateTaskInput } from '../microsoft-todo/microsoft-todo.types';

export abstract class SyncService {
  protected abstract getLists(userId: number);

  protected abstract createList(userId: number, listName: string);

  protected abstract updateList(userId: number, listId: string, listName: string);

  protected abstract deleteList(userId: number, listId: string);

  protected abstract getTasksFromList(userId: number, listId: string);

  protected abstract getTask(userId: number, listId: string, taskId: string);

  protected abstract createTask(userId: number, listId: string, taskName: string);

  protected abstract updateTask(input: UpdateTaskInput);

  protected abstract deleteTask(userId: number, listId: string, taskId: string);
}
