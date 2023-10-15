import { Field, InputType, Int } from '@nestjs/graphql';
import { PaginatedInput } from '../../../shared/pagination.types';
import { Order } from '../../../shared/enums';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { OrderByTasksColumns } from '../tasks.enums';

@InputType()
export class CreateTaskInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  public name: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  public description?: string;

  @Field(() => Int, { nullable: false })
  @IsInt()
  @Min(1)
  public listId: number;
}

@InputType()
export class UpdateTaskInput extends CreateTaskInput {
  @Field(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  public id: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  public name: string;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  @IsOptional()
  public isDone: boolean;
}

@InputType()
export class TaskInput extends PaginatedInput {
  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  @IsOptional()
  public isDone: boolean;

  @Field(() => Order, { nullable: true, defaultValue: Order.ASCENDING })
  @IsOptional()
  public order: Order;

  @Field(() => OrderByTasksColumns, { defaultValue: OrderByTasksColumns.NAME })
  @IsOptional()
  public sortBy: OrderByTasksColumns;
}
