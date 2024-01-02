import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserEntity } from '../../../core/models/user-entity.model';
import { UserService } from '../../../core/rest/services/user.service';
import { AuthService } from '../../../core/rest/services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Subscription, noop, tap } from 'rxjs';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  userSettingsForm!: FormGroup;
  currentUser!: UserEntity;

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
  customConfirmEmailErrorMsgs = [
    {
      key: 'email-not-match',
      customKey: 'email-not-match'
    }
  ];

  constructor (
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const loggedUser = this.authService.getCurrentUser();
    this.getUser(loggedUser.id);
  }

  buildForm (user: UserEntity): void {
    this.userSettingsForm = this.formBuilder.group({
      firstName: new FormControl({
        value: user.firstName,
        disabled: true
      }, { updateOn: 'change' }),
      lastName: new FormControl({
        value: user.lastName,
        disabled: true
      }, { updateOn: 'change' }),
      email: new FormControl(user.email, {
        validators: [
          Validators.email
        ],
        updateOn: 'change'
      }),
      confirmEmail: new FormControl(user.email, {
        validators: [
          Validators.email
        ],
        updateOn: 'change'
      }),
      oldPassword: new FormControl(undefined, {
        updateOn: 'change'
      }),
      password: new FormControl(undefined, {
        validators: [
          Validators.minLength(8),
          Validators.maxLength(20)
        ],
        updateOn: 'change'
      }),
      confirmPassword: new FormControl(undefined, {
        validators: [
          Validators.minLength(8),
          Validators.maxLength(20)
        ],
        updateOn: 'change'
      })
    });

    this.userSettingsForm.get('confirmPassword')?.valueChanges
      .pipe(
        tap(value => {
          const passwordValue = this.userSettingsForm.get('password')?.value;
          if (passwordValue !== value) 
            this.userSettingsForm.get('confirmPassword')?.setErrors({'password-not-match': true});          
        })
      )
      .subscribe({
        next: noop,
        error: err => console.log(err)
      });

    this.userSettingsForm.get('password')?.valueChanges
      .pipe(
        tap(value => {
          const confirmPasswordValue = this.userSettingsForm.get('confirmPassword')?.value;
          if (confirmPasswordValue !== value) {
            this.userSettingsForm.get('confirmPassword')?.setErrors({'password-not-match': true});
          } else {
            this.userSettingsForm.get('confirmPassword')?.setErrors({'password-not-match': null});
            this.userSettingsForm.get('confirmPassword')?.updateValueAndValidity();
          }
        })
      )
      .subscribe({
        next: noop,
        error: err => console.log(err)
      });

    this.userSettingsForm.get('confirmEmail')?.valueChanges
      .pipe(
        tap(value => {
          const emailValue = this.userSettingsForm.get('email')?.value;
          if (emailValue !== value) 
            this.userSettingsForm.get('confirmEmail')?.setErrors({'email-not-match': true});          
        })
      )
      .subscribe({
        next: noop,
        error: err => console.log(err)
      });

    this.userSettingsForm.get('email')?.valueChanges
      .pipe(
        tap(value => {
          const confirmEmailValue = this.userSettingsForm.get('confirmEmail')?.value;
          if (confirmEmailValue !== value) {
            this.userSettingsForm.get('confirmEmail')?.setErrors({'email-not-match': true});
          } else {
            this.userSettingsForm.get('confirmEmail')?.setErrors({'email-not-match': null});
            this.userSettingsForm.get('confirmEmail')?.updateValueAndValidity();
          }
        })
      )
      .subscribe({
        next: noop,
        error: err => console.log(err)
      });
  }

  getUser (userId: string): Subscription {
    return this.userService.getUser(userId)
      .pipe(
        tap(result => {
          this.currentUser = result;
          this.buildForm(this.currentUser);
        })
      )
      .subscribe({
        next: noop,
        error: err => console.log(err)
        
      })
  }

  getControlValue (controlName: string): string {
    return this.userSettingsForm.controls[controlName].value;
  }

  onSubmit (): void {
    if (this.userSettingsForm?.invalid) {
      return this.notificationService.failureNotification(
        'GeneralMessages.errorNotificationTitle',
        'GeneralMessages.errorNotificationMessage'
      );
    }

    const email = this.getControlValue('email');
    const confirmEmail = this.getControlValue('confirmEmail');
    const oldPassword = this.getControlValue('oldPassword');
    const password = this.getControlValue('password');
    const confirmPassword = this.getControlValue('confirmPassword');

    if (oldPassword === null || oldPassword === '' || oldPassword === undefined) {
      this.userSettingsForm.patchValue({
        oldPassword: undefined,
        password: password === '' || password === null ? undefined : password,
        confirmPassword: confirmPassword === '' || confirmPassword === null ? undefined : confirmPassword
      });
    }

    const data = {
      ...this.userSettingsForm.value,
      email: email === '' ? null : email,
      confirmEmail: confirmEmail === '' ? null : confirmEmail
    };

    this.userService.updateUser(this.currentUser.id, data)
      .pipe(
        tap((result) => {
          this.notificationService.successNotification(
            'GeneralMessages.successNotificationTitle',
            'UserSettingsComponent.' + result.resultKeys
          );

          this.currentUser.role === 'ADMIN' 
            ? this.router.navigate(['/users'])
            : this.router.navigate(['/meetings']);
        })
      )
      .subscribe({
        next: noop,
        error: (err) => {
          this.notificationService.showErrorNotification('UserSettingsComponent', err.error.resultKeys);
        }
      })
  }

  onCancel (): void {
    this.currentUser.role === 'ADMIN' 
      ? this.router.navigate(['/users'])
      : this.router.navigate(['/meetings']);
  }
}
