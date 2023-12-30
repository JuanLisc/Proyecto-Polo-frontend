import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetingRoutingModule } from './meeting-routing.module';
import { MeetingListComponent } from './meeting-list/meeting-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormErrorsModule } from '../../../shared/components/form-errors/form-errors.module';
import { FlexModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../../../shared/material/material.module';


@NgModule({
  declarations: [
    MeetingListComponent
  ],
  imports: [
    CommonModule,
    MeetingRoutingModule,
    TranslateModule,
    FormErrorsModule,
    FlexModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MaterialModule
  ]
})
export class MeetingModule { }
