import { Field, InputType } from '@nestjs/graphql';
import { PaginatedInput } from '../../../shared/pagination.types';
import { Order } from '../../../shared/enums';
import { IsOptional } from 'class-validator';
import { OrderByTasksColumns } from '../tasks.enums';

@InputType()
export class TaskInput extends PaginatedInput {
  @Field(() => Order, { nullable: true, defaultValue: Order.ASCENDING })
  @IsOptional()
  public order: Order;

  @Field(() => OrderByTasksColumns, { defaultValue: OrderByTasksColumns.NAME })
  @IsOptional()
  public sortBy: OrderByTasksColumns;
}
