import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/rest/services/user.service';
import { Router } from '@angular/router';
import { noop, tap } from 'rxjs';
import { Roles } from '../../../../shared/utils/enums';
import { NotificationService } from '../../../../shared/services/notification.service';
import { AuthService } from '../../../core/rest/services/auth.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage = '';
  roles = Object.values(Roles);
  
  loggedUser = this.authService.getCurrentUser();

  customFirstNameErrorMsgs = [
    {
      key: 'minlength',
      customKey: 'firstName-min-length'
    },
    {
      key: 'maxlength',
      customKey: 'firstName-max-length'
    },
    {
      key: 'space-at-beginning',
      customKey: 'firstName-space-at-beginning'
    }
  ];
  customLastNameErrorMsgs = [
    {
      key: 'minlength',
      customKey: 'lastName-min-length'
    },
    {
      key: 'maxlength',
      customKey: 'lastName-max-length'
    },
    {
      key: 'space-at-beginning',
      customKey: 'lastName-space-at-beginning'
    }
  ];
  customConfirmEmailErrorMsgs = [
    {
      key: 'email-not-match',
      customKey: 'email-not-match'
    }
  ];
  customPasswordErrorMsgs = [
    {
      key: 'minlength',
      customKey: 'password-min-length'
    },
    {
      key: 'maxlength',
      customKey: 'password-max-length'
    }
  ];
  customConfirmPasswordErrorMsgs = [
    {
      key: 'minlength',
      customKey: 'password-min-length'
    },
    {
      key: 'maxlength',
      customKey: 'password-max-length'
    },
    {
      key: 'password-not-match',
      customKey: 'password-not-match'
    }
  ];

  get role(): FormControl {
    return this.registerForm.get('role') as FormControl;
  }

  constructor (
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService
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
        updateOn: 'change'
      })
    });

    this.registerForm.get('confirmPassword')?.valueChanges
      .pipe(
        tap(value => {
          const passwordValue = this.registerForm.get('password')?.value;
          if (passwordValue !== value) 
            this.registerForm.get('confirmPassword')?.setErrors({'password-not-match': true});          
        })
      )
      .subscribe({
        next: noop,
        error: err => console.log(err)
      });

    this.registerForm.get('password')?.valueChanges
      .pipe(
        tap(value => {
          const confirmPasswordValue = this.registerForm.get('confirmPassword')?.value;
          if (confirmPasswordValue !== value) {
            this.registerForm.get('confirmPassword')?.setErrors({'password-not-match': true});
          } else {
            this.registerForm.get('confirmPassword')?.setErrors({'password-not-match': null});
            this.registerForm.get('confirmPassword')?.updateValueAndValidity();
          }
        })
      )
      .subscribe({
        next: noop,
        error: err => console.log(err)
      });

    this.registerForm.get('confirmEmail')?.valueChanges
      .pipe(
        tap(value => {
          const emailValue = this.registerForm.get('email')?.value;
          if (emailValue !== value) 
            this.registerForm.get('confirmEmail')?.setErrors({'email-not-match': true});          
        })
      )
      .subscribe({
        next: noop,
        error: err => console.log(err)
      });

    this.registerForm.get('email')?.valueChanges
      .pipe(
        tap(value => {
          const confirmEmailValue = this.registerForm.get('confirmEmail')?.value;
          if (confirmEmailValue !== value) {
            this.registerForm.get('confirmEmail')?.setErrors({'email-not-match': true});
          } else {
            this.registerForm.get('confirmEmail')?.setErrors({'email-not-match': null});
            this.registerForm.get('confirmEmail')?.updateValueAndValidity();
          }
        })
      )
      .subscribe({
        next: noop,
        error: err => console.log(err)
      });

    this.registerForm.get('firstName')?.valueChanges
      .pipe(
        tap((value: string) => {
          if (value[0] === ' ') this.registerForm.get('firstName')?.setErrors({'firstName-space-at-beginning': true});
          if (value.trimEnd().length < 2) this.registerForm.get('firstName')?.setErrors({'firstName-min-length': true});
        })
      )
      .subscribe({
        next: noop,
        error: err => console.log(err)
      });

    this.registerForm.get('lastName')?.valueChanges
      .pipe(
        tap((value: string) => {
          if (value[0] === ' ') this.registerForm.get('lastName')?.setErrors({'lastName-space-at-beginning': true});
          if (value.trimEnd().length < 2) this.registerForm.get('lastName')?.setErrors({'lastName-min-length': true});
        })
      )
      .subscribe({
        next: noop,
        error: err => console.log(err)
      });
  }

  ngOnInit(): void {
    this.buildRegisterForm();
  }

  onSubmit (): void {
    if (this.registerForm?.invalid) {
      this.notificationService.failureNotification(
        'GeneralMessages.errorNotificationTitle',
        'GeneralMessages.errorNotificationMessage'
      );
      return;
    }

    this.userService.createUser(this.registerForm.value)
      .pipe(
        tap(result => {
          this.notificationService.successNotification(
            'GeneralMessages.successNotificationTitle',
            'UserCreateComponent.' + result.resultKeys
          );
          this.router.navigate(['/users']);
        })
      )
      .subscribe({
        next: noop,
        error: (err) => {
          this.notificationService.showErrorNotification('UserCreateComponent', err.error.resultKeys);
        }
      })
  }

  onCancel (): void {
    this.router.navigate(['users']);
  }
}
