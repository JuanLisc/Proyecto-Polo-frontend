import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/rest/services/auth.service';
import { UserEntity } from './core/models/user-entity.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  currentUser!: UserEntity;
  token!: string | null;

  constructor (
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setLanguage();

    this.token = this.authService.getCurrentToken();
    if (this.token !== null && this.token !== undefined) {
      this.currentUser = this.authService.getCurrentUser();
      let firstLogin = sessionStorage.getItem('firstLogin');
      
      if (firstLogin === null || firstLogin === undefined) {
        sessionStorage.setItem('firstLogin', 'true');
      }
      //this.router.navigate(['/users']);
    } else {
      this.router.navigate(['/login']);
    }  
  }

  setLanguage(): void {
    this.translateService.setDefaultLang('es');
    if (window.Intl && typeof window.Intl === 'object') {
      this.translateService.use(navigator.language);
    }
  }
}
