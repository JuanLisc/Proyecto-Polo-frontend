import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { Roles } from '../../../shared/utils/enums';
import { UserSettingsComponent } from './user-settings/user-settings.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: {
      role: [Roles.ADMIN]
    }
  },
  {
    path: 'create',
    component: UserCreateComponent,
    canActivate: [AuthGuard],
    data: {
      role: [Roles.ADMIN]
    }
  },
  {
    path: 'settings',
    component: UserSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
