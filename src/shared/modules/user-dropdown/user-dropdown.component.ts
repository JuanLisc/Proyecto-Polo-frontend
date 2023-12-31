import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/core/rest/services/auth.service';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.scss']
})
export class UserDropdownComponent implements OnInit {
  currentUserFullName!: string;

  constructor (
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    this.currentUserFullName = `${currentUser.firstName} ${currentUser.lastName}`;
  }

  goToSettings (): void {
    this.router.navigate(['users', 'settings']);
  }

  logout (): void {
    this.authService.logout();
  }
}
