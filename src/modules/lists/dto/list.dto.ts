import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PaginatedOutput } from '../../../shared/pagination.types';
import { PaginatedTasks } from '../../tasks/dto/task.dto';

@ObjectType()
export class PaginatedLists extends PaginatedOutput<List> {
  @Field(() => [List], { nullable: true, defaultValue: [] })
  public data: List[];
}

@ObjectType()
export class List {
  @Field(() => Int)
  public id: number;

  @Field(() => String)
  public name: string;

  @Field(() => String, { nullable: true })
  public description: string;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}

@ObjectType()
export class ListDetails extends List {
  @Field(() => PaginatedTasks)
  public tasks: PaginatedTasks;
}
