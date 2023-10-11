import { Field, InputType } from '@nestjs/graphql';
import { PaginatedInput } from '../../../shared/pagination.types';
import { Order } from '../../../shared/enums';
import { IsOptional } from 'class-validator';
import { OrderByListsColumns } from '../lists.enum';

@InputType()
export class CreateListInput {
  @Field(() => String)
  public name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  public description?: string;
}

@InputType()
export class UpdateListInput extends CreateListInput {
  @Field(() => Number)
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
