import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormErrorsComponent } from './form-errors.component';
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [
    FormErrorsComponent
  ],
  exports: [
    FormErrorsComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule
  ]
})
export class FormErrorsModule { }
