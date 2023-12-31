import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UserEntity } from '../../models/user-entity.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Roles } from '../../../../shared/utils/enums';
import { NotificationService } from '../../../../shared/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.API_URL;
  token!: string;
  private readonly AUTH = 'auth';
  currentUser!: UserEntity;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {}

  login (email: string, password: string, keepSessionOpen: boolean): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.AUTH}/login`, { email, password })
      .pipe(
        map((response: any) => {
          this.token = response.data.token;
          this.currentUser = response.data.result;

          sessionStorage.setItem('firstLogin', 'true');
          this.storeUserData(keepSessionOpen, response.data.result, response.data.token);

          return this.currentUser;
        }),
        catchError(err => {
          this.notificationService.failureNotification(
            'GeneralMessages.errorNotificationTitle',
            'LoginComponent.incorrect-data'
          )
          return throwError(() => new Error(err));
        })
      )
  }

  logout (): void {
    if (this.isLoggedIn()) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } else {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    }
    sessionStorage.removeItem('firstLogin');
    this.router.navigate(['/login']);
  }

  isLoggedIn (): boolean {
    return !!JSON.parse(localStorage.getItem('user') as string);
  }

  getCurrentUser (): UserEntity {
    return this.isLoggedIn()
      ? JSON.parse(localStorage.getItem('user') as string)
      : JSON.parse(sessionStorage.getItem('user') as string);
  }

  getCurrentToken (): string {
    return this.isLoggedIn()
      ? localStorage.getItem('token') as string
      : sessionStorage.getItem('token') as string;
  }

  checkUserPermissions (roles: Roles[]): boolean {
    const user: UserEntity = this.getCurrentUser();
    return roles.includes(user.role as Roles);
  }

  updateCurrentUser (user: UserEntity): void {
    if (this.isLoggedIn()) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }

  storeUserData (keepSessionOpen: boolean, user: UserEntity, token: string): void {
    if (keepSessionOpen) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('token', token);
    }
  }
}
