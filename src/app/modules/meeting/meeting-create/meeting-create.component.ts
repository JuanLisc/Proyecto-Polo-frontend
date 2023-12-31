import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MeetingService } from '../../../core/rest/services/meeting.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../shared/services/notification.service';
import { noop, tap } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-meeting-create',
  templateUrl: './meeting-create.component.html',
  styleUrls: ['./meeting-create.component.css']
})
export class MeetingCreateComponent implements OnInit {
  createMeetingForm!: FormGroup;
  errorMessage!: string;

  constructor (
    private readonly formBuilder: FormBuilder,
    private readonly meetingService: MeetingService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
    private readonly dialogRef: MatDialogRef<MeetingCreateComponent>
  ) {}

  buildCreateFrom (): void {
    this.createMeetingForm = this.formBuilder.group({
      detail: new FormControl('', {
        validators: [
          Validators.required,
          Validators.maxLength(200)
        ],
        updateOn: 'change'
      }),
      date: new FormControl('', {
        validators: [
          Validators.required
        ],
        updateOn: 'change'
      }),
      hour: new FormControl('', {
        validators: [
          Validators.required,
          Validators.min(8),
          Validators.max(22)
        ],
        updateOn: 'change'
      }),
      duration: new FormControl('', {
        validators: [
          Validators.required
        ]
      })
    })
  }

  ngOnInit(): void {
    this.buildCreateFrom();
  }

  onSubmit (): void {
    if (this.createMeetingForm?.invalid) {
      this.notificationService.failureNotification(
        'GeneralMessages.errorNotificationTitle',
        'GeneralMessages.errorNotificationMessage'
      );
      return;
    }

    console.log(this.createMeetingForm.value);
    
    this.meetingService.createMeeting(this.createMeetingForm.value)
      .pipe(
        tap(result => {
          this.notificationService.successNotification(
            'GeneralMessages.successNotificationTitle',
            'MeetingCreateComponent.' + result.resultKeys
          );
          this.dialogRef.close(true);
        })
      )
      .subscribe({
        next: noop,
        error: (err) => {
          this.notificationService.showErrorNotification('MeetingCreateComponent', err.error.resultKeys);
        }
      })
  }

  onCancel (): void {
    this.dialogRef.close(false);
  }
}