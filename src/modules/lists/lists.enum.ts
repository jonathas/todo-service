import { registerEnumType } from '@nestjs/graphql';

export enum OrderByListsColumns {
  ID = 'id',
  NAME = 'name',
  CREATED = 'created'
}

registerEnumType(OrderByListsColumns, {
  name: 'OrderByListsColumns'
});
