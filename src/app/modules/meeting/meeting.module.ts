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
import { MeetingCreateComponent } from './meeting-create/meeting-create.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ButtonModule } from '../../../shared/directives';


@NgModule({
  declarations: [
    MeetingListComponent,
    MeetingCreateComponent
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
    MaterialModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    ButtonModule
  ]
})
export class MeetingModule { }
