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

  login (email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.AUTH}/login`, { email, password })
      .pipe(
        map((response: any) => {
          this.token = response.data.token;
          this.currentUser = response.data.result;

          localStorage.setItem('user', JSON.stringify(this.currentUser));
          localStorage.setItem('token', this.token);

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
    }

    this.router.navigate(['/login']);
  }

  isLoggedIn (): boolean {
    return !!JSON.parse(localStorage.getItem('user') as string);
  }

  getCurrentUser (): UserEntity {
    return JSON.parse(localStorage.getItem('user') as string);
  }

  getCurrentToken (): string {
    return localStorage.getItem('token') as string;
  }

  checkUserPermissions (roles: Roles): boolean {
    const user: UserEntity = this.getCurrentUser();
    return roles.includes(user.role);
  }

  updateCurrentUser (user: UserEntity): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
}
