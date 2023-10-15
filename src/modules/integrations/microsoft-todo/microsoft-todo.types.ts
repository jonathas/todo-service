import { HttpMethod } from '../../../shared/enums';

export class UpdateTaskInput {
  public userId: number;

  public listId: string;

  public taskId: string;

  public taskName: string;
}

export class CallMicrosoftGraphAPIInput {
  public userId: number;

  public url: string;

  public method: HttpMethod;

  public body?: unknown;
}
