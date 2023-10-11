import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PaginatedOutput } from '../../../shared/pagination.types';
import { Task } from '../../tasks/dto/task.dto';

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

  @Field(() => String)
  public description: string;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date)
  public updatedAt: Date;
}

@ObjectType()
export class ListDetails extends List {
  @Field(() => [Task])
  public tasks: Task[];
}
