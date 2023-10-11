import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

@InputType({ isAbstract: true })
export abstract class PaginatedInput {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsInt()
  @IsOptional()
  public offset?: number;

  @Field(() => Int, { nullable: true, defaultValue: 100 })
  @Transform(({ value }) => (!value || value > 100 ? 100 : value))
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(100)
  public limit?: number;
}

@ObjectType({ isAbstract: true })
export abstract class PaginatedOutput<T> {
  public abstract data: T[];

  @Field(() => Int)
  public totalCount: number;
}
