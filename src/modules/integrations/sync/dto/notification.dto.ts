import { Field, ObjectType } from '@nestjs/graphql';
import { Task } from '../../../tasks/dto/task.dto';
import { WebhookChangeType } from '../../microsoft-todo/microsoft-todo.types';

@ObjectType()
export class Notification {
  @Field(() => WebhookChangeType)
  public changeType: WebhookChangeType;

  @Field(() => Task)
  public data: Task;
}
