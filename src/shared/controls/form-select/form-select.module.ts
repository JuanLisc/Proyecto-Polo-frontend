import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormSelectComponent } from './form-select.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';



@NgModule({
  declarations: [
    FormSelectComponent
  ],
  exports: [
    FormSelectComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatOptionModule
  ]
})
export class FormSelectModule { }
