import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ErrorMessages } from 'src/shared/utils/error-messages';

@Component({
  selector: 'app-form-errors',
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss']
})
export class FormErrorsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() control!: FormControl | AbstractControl | null;
  @Input() fieldName!: string;
  @Input() type: 'small' | 'mat' | 'none' = 'mat';
  @Input() customErrorMsg: Array<{ key: string, customKey: string }> | null = null;

  subscription!: Subscription;

  error: string | undefined;

  constructor(
    protected errorMessages: ErrorMessages
  ) {}

  ngOnInit(): void {
    this.error = this.getError();
    this.subscribeToControlChanges();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('control' in changes) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.subscribeToControlChanges();
    }
  }

  getError(): string | undefined {
    if (!this.control) {
      return undefined;
    }
    const controlErrors = this.control.errors;
    if (controlErrors && this.isPolluted()) {
      const keys = Object.keys(controlErrors);

      for (const keyError of keys) {
        if (this.customErrorMsg) {
          const customKey = (this.customErrorMsg.find(item => item.key === keyError))?.customKey;          
          if (customKey) {
            return this.errorMessages.getFormErrorMessage(customKey);
          } else {
            return this.getErrorMsg(keyError);
          }
        } else {
          return this.getErrorMsg(keyError);
        }
      }
    }

    return undefined;
  }

  getErrorMsg(keyError: string): string {
    let msg: string;
    if (this.fieldName) {
      msg = this.errorMessages.getFormErrorMessage(keyError, this.fieldName);
    } else {
      msg = this.errorMessages.getFormErrorMessage(keyError);
    }
    return msg;
  }

  subscribeToControlChanges(): Subscription | undefined {
    if (this.control) {
      this.error = this.getError();
      this.subscription = this.control.statusChanges.subscribe(
        status => {
          if (status === 'INVALID') {
            this.error = this.getError();
          } else if (status === 'VALID') {
            this.error = undefined;
          }
        }
      );
    }
    return undefined;
  }

  isPolluted(): boolean {
    return (!!this.control && !this.control.valid && this.control.dirty);
  }
}
