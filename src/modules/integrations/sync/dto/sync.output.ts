import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SyncStats {
  @Field(() => Number)
  public created: number;

  @Field(() => Number)
  public updated: number;

  @Field(() => Number)
  public deleted: number;

  public constructor(created: number, updated: number, deleted: number) {
    this.created = created;
    this.updated = updated;
    this.deleted = deleted;
  }
}

@ObjectType()
export class SyncOutput {
  @Field(() => SyncStats)
  public lists: SyncStats;

  @Field(() => SyncStats)
  public tasks: SyncStats;
}
