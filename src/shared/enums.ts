import { registerEnumType } from '@nestjs/graphql';

export enum Environments {
  TEST = 'test',
  DEVELOPMENT = 'development',
  STAGE = 'stage',
  PRODUCTION = 'production'
}

export enum Order {
  ASCENDING = 'ASC',
  DESCENDING = 'DESC'
}

registerEnumType(Order, {
  name: 'Order'
});
