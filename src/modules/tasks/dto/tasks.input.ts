import { Field, InputType, Int } from '@nestjs/graphql';
import { PaginatedInput } from '../../../shared/pagination.types';
import { Order } from '../../../shared/enums';
import { IsOptional } from 'class-validator';
import { OrderByTasksColumns } from '../tasks.enums';

@InputType()
export class CreateTaskInput {
  @Field(() => String)
  public name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  public description?: string;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  public listsIds?: number[];
}

@InputType()
export class UpdateTaskInput extends CreateTaskInput {
  @Field(() => Number)
  public id: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  public name: string;

  @Field(() => Boolean, { defaultValue: false })
  @IsOptional()
  public isDone: boolean;
}

@InputType()
export class TaskInput extends PaginatedInput {
  @Field(() => Boolean, { defaultValue: false })
  @IsOptional()
  public isDone: boolean;

  @Field(() => Order, { nullable: true, defaultValue: Order.ASCENDING })
  @IsOptional()
  public order: Order;

  @Field(() => OrderByTasksColumns, { defaultValue: OrderByTasksColumns.NAME })
  @IsOptional()
  public sortBy: OrderByTasksColumns;
}
