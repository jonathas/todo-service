import { DataSource, QueryRunner } from 'typeorm';

export class QueryRunnerHelper {
  public static async initQueryRunner(dataSource: DataSource): Promise<QueryRunner> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }
}
