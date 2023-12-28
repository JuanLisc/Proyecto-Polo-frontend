import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Logger } from 'src/shared/logger';
import { RestService } from 'src/app/core/rest/rest.service';

const EMPTY_OPTION = Object.seal({
  value: undefined,
  labelKey: 'FormSelectComponent.empty-label'
});

@Component({
  selector: 'app-form-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // tslint:disable:no-forward-ref
      useExisting: forwardRef(() => FormSelectComponent),
      multi: true
    }
  ]
})
/**
 * Select component that automatically looks up for data from a rest service.
 * It also delegates Form validation and change propagation to the MatSelect component.
 * If you need a mat-select to be @Input here add it.
 */
export class FormSelectComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input() matStyle!: { [klass: string]: any; };

  @ViewChild('matSelect') private readonly matSelect!: MatSelect;

  /**
   * RestService<T> for looking up the entities to display.
   */
  @Input() service!: RestService<any>;
  /**
   * The option value key.
   */
  @Input() valueKey!: string;
  /**
   * The option label key
   */
  @Input() optionKey!: string;
  @Input() placeholder!: string;
  @Input() formControl!: FormControl;
  /**
   * Select multiple or single
   */
  @Input() multiple!: boolean;
  @Input() showSelectAll!: boolean;
  /**
   * Mat-Form appearance attribute.
   */
  @Input() appearance: MatFormFieldAppearance = 'outline';
  /**
   * If no RestService is provided, you can pass around the items.
   */
  @Input() items!: Array<any> | null;

  @Output() readonly selectionChange: EventEmitter<any> = new EventEmitter();
  @Output() readonly closeSelect: EventEmitter<any> = new EventEmitter();

  @Input() compareWith!: (o1: any, o2: any) => boolean;

  @Input() requiredLabel!: boolean;

  _emptyOption: {labelKey: string, value: any} | undefined;

  @Input() set emptyOption(value: { labelKey: string, value: any } | undefined) {
    if (typeof value === 'object') {
      this._emptyOption = {
        labelKey: value.labelKey,
        value: value.value
      };
    } else {
      this._emptyOption = undefined;
    }
  }

  get emptyOption():  { labelKey: string, value: any } | undefined {
    return this._emptyOption;
  }

  elements!: Array<any>;

  constructor(protected logger: Logger) {

  }

  ngOnInit(): void {
    if (this.compareWith) {
      /* Cannot do it via HTML attribute
      If undefined is passed through, it will throw an error when trying to
      compare.*/
      this.matSelect.compareWith = this.compareWith;
    }
    if (this.service) {
      this.service.all()
        .subscribe((data: any) => {
            this.elements = data;
          },
          (error: any) => {
            this.logger.error(error);
          });
    } else {
      this.elements = this.items || [];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.elements = changes['items'].currentValue || [];
    }
    if (changes['compareWith']) {
      this.matSelect.compareWith = this.compareWith;
    }
  }

  getValueForOption(element: any): any {
    if (this.valueKey) {
      return element[this.valueKey];
    }
    return element;
  }

  trackByFn(index: number, element: any): any {
    if (element && element.id) {
      return element.id;
    } else {
      return index;
    }
  }

  writeValue(obj: any): void {
    this.matSelect?.writeValue(obj);
  }

  registerOnChange(fn: any): void {
    this.matSelect?.registerOnChange(fn);
  }

  registerOnTouched(fn: any): void {
    this.matSelect?.registerOnTouched(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.matSelect?.setDisabledState(isDisabled);
  }

  getValues(): Array<any> {
    return this.elements;
  }

  selectOption(value: any): void {
    this.selectionChange.emit(value);
  }

  isChecked(): boolean {
    if (this.formControl) {
      return this.formControl.value && this.elements.length
        && this.formControl.value.length === this.elements.length;
    }
    return false;
  }

  isIndeterminate(): boolean {
    if (this.formControl) {
      return this.formControl.value && this.formControl.value.length && this.elements.length
        && this.formControl.value.length < this.elements.length;
    }
    return false;
  }

  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) { // select all values
      const all = [];
      for (const e of this.elements) {
        const val = this.getValueForOption(e);
        if (val) { all.push(val); }
      }
      // check if a form control was given
      if (this.formControl) {
        this.formControl.setValue(all);
      }
      this.selectionChange.emit(all);
    } else { // clear all values
      if (this.formControl) {
        this.formControl.setValue([]);
      }
      this.selectionChange.emit([]);
    }
  }

  openChange(event: any): void {
    this.closeSelect.emit(event);
  }

}
