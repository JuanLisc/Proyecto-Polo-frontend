import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeetingListComponent } from './meeting-list/meeting-list.component';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { Roles } from '../../../shared/utils/enums';

const routes: Routes = [
  {
    path: '',
    component: MeetingListComponent,
    canActivate: [AuthGuard],
    data: {
      role: [Roles.ADMIN, Roles.USER]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingRoutingModule { }
