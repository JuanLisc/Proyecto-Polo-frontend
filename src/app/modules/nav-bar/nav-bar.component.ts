import { Component } from '@angular/core';
import { AuthService } from '../../core/rest/services/auth.service';
import { Roles } from '../../../shared/utils/enums';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
	
	constructor (
		private readonly authService: AuthService
	) {}

	get canAccessUserModule (): boolean {
		const admittedRoles = [Roles.ADMIN];

		return this.authService.checkUserPermissions(admittedRoles);
	}

	get canAccessMeetingModule (): boolean {
		const admittedRoles = [Roles.ADMIN, Roles.USER];
		return this.authService.checkUserPermissions(admittedRoles);
	}
}
