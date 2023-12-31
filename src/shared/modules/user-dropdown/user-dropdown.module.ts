import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDropdownComponent } from './user-dropdown.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    UserDropdownComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatMenuModule,
    MatIconModule,
    RouterModule
  ],
  exports: [
    UserDropdownComponent
  ]
})
export class UserDropdownModule { }
