import { Field, InputType } from '@nestjs/graphql';
import { PaginatedInput } from '../../../shared/pagination.types';
import { Order } from '../../../shared/enums';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { OrderByListsColumns } from '../lists.enum';

@InputType()
export class CreateListInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  public name: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  public description?: string;
}

@InputType()
export class UpdateListInput extends CreateListInput {
  @Field(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  public id: number;
}

@InputType()
export class ListInput extends PaginatedInput {
  @Field(() => Order, { nullable: true, defaultValue: Order.ASCENDING })
  @IsOptional()
  public order: Order;

  @Field(() => OrderByListsColumns, { defaultValue: OrderByListsColumns.NAME })
  @IsOptional()
  public sortBy: OrderByListsColumns;
}
