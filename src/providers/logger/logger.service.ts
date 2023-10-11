import { Injectable, Scope } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends PinoLogger {
  public setContext(value: string): void {
    super.setContext(value);
  }

  public trace(...args: any[]): void {
    super.trace(args);
  }

  public info(...args: any[]): void {
    super.info(args);
  }

  /**
   * @description prefer to use info() instead of this method
   */
  public log(...args: any[]): void {
    super.info(args);
  }

  public error(...args: any[]): void {
    super.error(args);
  }

  public warn(...args: any[]): void {
    super.warn(args);
  }

  public debug(...args: any[]): void {
    super.debug(args);
  }

  public fatal(...args: any[]): void {
    super.fatal(args);
  }
}
