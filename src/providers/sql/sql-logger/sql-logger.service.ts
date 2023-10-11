import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger as TypeOrmLogger } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { DatabaseConfig } from '../../../config/database.config';

type LoggerOptions = 'log' | 'info' | 'warn' | 'query' | 'schema' | 'error' | 'migration';

@Injectable()
export class SqlLoggerService implements TypeOrmLogger {
  private loggerOptions: LoggerOptions[] = ['error', 'warn'];

  public constructor(
    @Inject(forwardRef(() => LoggerService))
    private applicationLogger: LoggerService,
    private config: ConfigService
  ) {
    this.applicationLogger.setContext(SqlLoggerService.name);
    if (this.config.get<DatabaseConfig>('database').logQueries) {
      this.loggerOptions.push('query');
    }
  }

  private isInLoggerOptions(level: LoggerOptions): boolean {
    return Array.isArray(this.loggerOptions) && this.loggerOptions.includes(level);
  }

  public logQuery(query: string, parameters?: unknown[]) {
    if (this.isInLoggerOptions('query')) {
      this.applicationLogger.debug({
        query,
        ...(parameters ? { parameters } : {})
      });
    }
  }

  public logQueryError(error: string | Error, query: string, parameters?: unknown[]) {
    if (this.isInLoggerOptions('error')) {
      this.applicationLogger.error({
        error,
        query,
        ...(parameters ? { parameters } : {})
      });
    }
  }

  public logQuerySlow(time: number, query: string, parameters?: unknown[]) {
    if (this.isInLoggerOptions('warn')) {
      this.applicationLogger.warn({
        queryTag: 'SLOW QUERY',
        queryExecutionTime: `${time} ms`,
        query,
        ...(parameters ? { parameters } : {})
      });
    }
  }

  private logSchemaBuildOrMigration(message: string) {
    if (this.isInLoggerOptions('info')) {
      this.applicationLogger.info({ message });
    }
  }

  public logSchemaBuild(message: string) {
    this.logSchemaBuildOrMigration(message);
  }

  public logMigration(message: string) {
    this.logSchemaBuildOrMigration(message);
  }

  public log(level: 'log' | 'info' | 'warn', message: unknown) {
    if (this.isInLoggerOptions(level)) {
      this.applicationLogger[level]({ message });
    }
  }
}
