import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/rest/services/user.service';
import { Router } from '@angular/router';
import { noop, tap } from 'rxjs';
import { Roles } from '../../../../shared/utils/enums';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage = '';
  roles = Object.values(Roles);

  get role(): FormControl {
    return this.registerForm.get('role') as FormControl;
  }

  constructor (
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router,
  ) {}

  buildRegisterForm (): void {
    this.registerForm = this.formBuilder.group({
      email: new FormControl('', {
        validators: [
          Validators.email,
          Validators.required
        ],
        updateOn: 'change'
      }),
      confirmEmail: new FormControl('', {
        validators: [
          Validators.email,
          Validators.required
        ],
        updateOn: 'change'
      }),
      firstName: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ],
        updateOn: 'change'
      }),
      lastName: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50)
        ],
        updateOn: 'change'
      }),
      password: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20)
        ],
        updateOn: 'change'
      }),
      confirmPassword: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20)
        ],
        updateOn: 'change'
      }),
      role: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'change'
      })
    });
  }

  ngOnInit(): void {
    this.buildRegisterForm();
  }

  onSubmit (): void {
    this.userService.createUser(this.registerForm.value)
      .pipe(
        tap(result => {
          //TODO: implementar un servicio de notificaciones
          this.router.navigate(['/users']);
        })
      )
      .subscribe({
        next: noop,
        error: (err) => {
          console.log(err);
          //TODO: IMPLEMENTAR NOTIFICACIONES
        }
      })
  }

  onCancel (): void {
    this.router.navigate(['users']);
  }
}
