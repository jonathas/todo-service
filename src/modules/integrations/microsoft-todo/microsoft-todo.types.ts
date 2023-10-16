export enum TaskStatus {
  NOT_STARTED = 'notStarted',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
  WAITING_ON_OTHERS = 'waitingOnOthers',
  DEFERRED = 'deferred'
}

export enum WebhookChangeType {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted'
}

export class UpdateMicrosoftTaskInput {
  public listId: string;

  public taskId: string;

  public title?: string;

  public status: TaskStatus;
}
