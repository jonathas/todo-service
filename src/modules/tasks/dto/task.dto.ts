import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PaginatedOutput } from '../../../shared/pagination.types';
import { List } from '../../lists/dto/list.dto';

@ObjectType()
export class PaginatedTasks extends PaginatedOutput<Task> {
  @Field(() => [Task], { nullable: true, defaultValue: [] })
  public data: Task[];
}

@ObjectType()
export class Task {
  @Field(() => Int)
  public id: number;

  @Field(() => String)
  public name: string;

  @Field(() => String, { nullable: true })
  public description: string;

  @Field(() => Boolean)
  public isDone: boolean;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;

  @Field(() => List, { nullable: true })
  public list?: List;
}
