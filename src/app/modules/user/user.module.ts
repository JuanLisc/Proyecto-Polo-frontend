import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { MaterialModule } from '../../../shared/material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { UserCreateComponent } from './user-create/user-create.component';
import { FormErrorsModule } from '../../../shared/components/form-errors/form-errors.module';
import { FormSelectModule } from '../../../shared/controls/form-select/form-select.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    UserListComponent,
    UserCreateComponent,
    UserSettingsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    TranslateModule,
    FormErrorsModule,
    FormSelectModule,
    ReactiveFormsModule,
    FlexModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule
  ]
})
export class UserModule { }
