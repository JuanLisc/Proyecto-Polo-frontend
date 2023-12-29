import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserEntity } from '../../app/core/models/user-entity.model';
import { AuthService } from '../../app/core/rest/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor (
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const userLogged: UserEntity = this.authService.getCurrentUser();
    console.log('USER: ', userLogged);
    
    if (userLogged !== null || userLogged !== undefined) {
      if (route.data['role'].includes(userLogged.role)) {
        return true;
      } else {
        this.router.navigate(['']);
        return false;
      }
    }
    this.router.navigate(['']);
    return false;
  }
}
