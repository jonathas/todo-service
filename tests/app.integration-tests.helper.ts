export const GRAPHQL = '/graphql';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

export class AppTestHelper {
  public static gqlRequest(app: NestExpressApplication) {
    return request(app.getHttpServer()).post(GRAPHQL);
  }

  public static async truncateTable(app: NestExpressApplication, table: string) {
    const dataSource = app.get(DataSource);
    await dataSource.query(`TRUNCATE TABLE "${table}" CASCADE;`);
  }

  public static async truncateAllTables(app: NestExpressApplication) {
    const dataSource = app.get(DataSource);
    const tables = await dataSource.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE';
    `);

    await Promise.all(tables.map((table) => AppTestHelper.truncateTable(app, table.table_name)));
  }
}
