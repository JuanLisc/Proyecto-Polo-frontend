import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/rest/services/auth.service';
import { noop, tap } from 'rxjs';
import { UserEntity } from '../../../core/models/user-entity.model';
import { Roles } from '../../../../shared/utils/enums';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error = '';

  constructor (
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.email
        ],
        updateOn: 'change'
      }),
      password: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'change'
      })
    });
  }

  onSubmit(): void {
    this.authService.login(
      this.loginForm.controls['email'].value,
      this.loginForm.controls['password'].value
    )
      .pipe(
        tap((user: UserEntity) => {
          if (user.role === Roles.ADMIN) this.router.navigate(['/users']);
          else if (user.role === Roles.USER) this.router.navigate(['/meetings']);
          else this.router.navigate(['']);
        })
      )
      .subscribe({
        next: noop,
        error: (err) => {
          console.log('Error: ', err);
        }
      })
  }
}
