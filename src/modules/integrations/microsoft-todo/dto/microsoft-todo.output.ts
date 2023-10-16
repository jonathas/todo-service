import { TaskStatus } from '../microsoft-todo.types';

export class TaskOutput {
  public importance: string;

  public isReminderOn: boolean;

  public status: TaskStatus;

  public title: string;

  public createdDateTime: string;

  public lastModifiedDateTime: string;

  public id: string;

  public hasAttachments: boolean;

  public body: {
    content: string;
    contentType: string;
  };
}

export class TasksResponse {
  public value: TaskOutput[];
}

export class ListOutput {
  public id: string;

  public displayName: string;

  public isOwner: boolean;

  public isShared: boolean;

  public wellknownListName: string;
}

export class ListsResponse {
  public value: ListOutput[];
}
