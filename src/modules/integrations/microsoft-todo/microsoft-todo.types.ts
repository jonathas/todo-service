export enum TaskStatus {
  NOT_STARTED = 'notStarted',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
  WAITING_ON_OTHERS = 'waitingOnOthers',
  DEFERRED = 'deferred'
}

export class UpdateMicrosoftTaskInput {
  public listId: string;

  public taskId: string;

  public taskName: string;

  public status: TaskStatus;
}
