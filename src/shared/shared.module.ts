import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material/material.module';
import { MatMenuModule } from '@angular/material/menu';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    MatMenuModule,
    FlexLayoutModule,
    MatButtonModule,
    TranslateModule.forChild()
  ],
  exports: [
    FlexLayoutModule,
    MaterialModule,
  ]
})
export class SharedModule { }
