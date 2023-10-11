import { registerEnumType } from '@nestjs/graphql';

export enum OrderByTasksColumns {
  ID = 'id',
  NAME = 'name',
  CREATED = 'created'
}

registerEnumType(OrderByTasksColumns, {
  name: 'OrderByTasksColumns'
});
