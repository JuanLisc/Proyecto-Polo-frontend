import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserEntity } from '../../../core/models/user-entity.model';
import { UserService } from '../../../core/rest/services/user.service';
import { Router } from '@angular/router';
import { Subscription, noop, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Roles } from '../../../../shared/utils/enums';
import { AuthService } from '../../../core/rest/services/auth.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  usersList: UserEntity[] = [];
  sub!: Subscription;
  errorMessage!: string;
  columnsToDisplay = ['email', 'firstName', 'lastName', 'role', "actions"];

  constructor (
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit (): void {
    this.sub = this.getUsers();
  }

  getUsers (): Subscription {
    return this.userService.getUsers().pipe(
      tap(data => {
        this.usersList = data
      })
    ).subscribe({
      next: noop,
      error: err => this.errorMessage = err
    });
  }

  handleNewUser (): void {
    this.router.navigate(['users', 'create']);
  }

  handleDeleteUser (userId: string): void {
    const admittedRol = Roles.ADMIN;
    
    if (!this.authService.checkUserPermissions(admittedRol)) {
      return;
    }

    this.userService.deleteUser(userId) //TODO: no cambia el hover cuando posicionamos el puntero arriba del icono
      .pipe(
        tap((result) => {
          this.notificationService.successNotification(
            'GeneralMessages.successNotificationTitle',
            'UserListComponent.delete.' + result.resultKeys
          );
          this.getUsers();
        })
      )
      .subscribe({
        next: noop,
        error: (err) => {
          this.notificationService.failureNotification(
            'GeneralMessages.errorNotificationTitle',
            'UserListComponent.' + err.resultKeys
          );
        }
      })
  }

  ngOnDestroy (): void { 
    this.sub.unsubscribe;
  }
}
