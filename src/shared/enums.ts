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

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS'
}
