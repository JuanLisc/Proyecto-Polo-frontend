import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../app/core/rest/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor (private readonly authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.authService.getCurrentToken();
    let currentUser = this.authService.getCurrentUser();
    let authReq: HttpRequest<unknown> = request;

    if (authToken !== undefined && currentUser !== undefined) {
      authReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${authToken}`)
      })
    }
    
    return next.handle(authReq);
  }
}
