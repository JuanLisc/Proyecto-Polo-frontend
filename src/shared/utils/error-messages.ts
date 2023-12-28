import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Logger } from '../../shared/logger';

// tslint:disable:object-literal-key-quotes
/**
 * Define error messages here.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorMessages {

  readonly FORM_ERROR_PREFIX = 'form-errors';

  constructor(protected logger: Logger, protected translateService: TranslateService) {

  }

  /**
   * Warning: this method is synchronous, which means it should be used if you are certain
   * the application has loaded correctly.
   * @param key - json key for the exception message.
   * @param parameter - parameter to replace the '#' in the string.
   */
  getFormErrorMessage(key: string, parameter = 'Field'): string {
    let result: string = this.translateService.instant(`${this.FORM_ERROR_PREFIX}.${key}`);
    if (!result || typeof result !== 'string') {
      result = '';
      this.logger.warn(`KEY: ${key} has no error message defined.`);
    }
    if (result.includes('#')) {
      return result.replace('#', parameter);
    }
    return result;
  }
}
