import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

const noop = (): any => undefined;

/**
 * A common logger that is used by the app.
 * This could be used with a remote log service to gather errors from clients.
 */
// tslint:disable:no-unbound-method
  // tslint:disable:no-console
@Injectable({
  providedIn: 'root'
})
export class Logger {

  private static invokeConsoleMethod(type: string, ...args: Array<any>): void {
    // Don't log in production
    if (!environment.production) {
      // @ts-ignore
      const logFn: Function = (console)[type] || console.log || noop;
      logFn.apply(console, ...args);
    }
  }

  info(...args: Array<any>): void {
    Logger.invokeConsoleMethod('info', args);
  }

  warn(...args: Array<any>): void {
    Logger.invokeConsoleMethod('warn', args);
  }

  error(...args: Array<any>): void {
    Logger.invokeConsoleMethod('error', args);
  }
}
