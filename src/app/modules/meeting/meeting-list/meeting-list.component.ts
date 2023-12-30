import { Component, OnDestroy, OnInit } from '@angular/core';
import { MeetingEntity } from '../../../core/models/meeting-entity.model';
import { Subscription, noop, tap } from 'rxjs';
import { MeetingService } from '../../../core/rest/services/meeting.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css']
})
export class MeetingListComponent implements OnInit, OnDestroy {
  meetingsList: MeetingEntity[] = [];
  sub!: Subscription;
  errorMessage!: string;
	columnsToDisplay = ['detail', 'date', 'hour', 'duration', 'actions'];

  constructor (
    private readonly meetingService: MeetingService,
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.sub = this.getMeetings();
  }

  getMeetings (): Subscription {
    return this.meetingService.getMeetings().pipe(
      tap(data => {
        this.meetingsList = data
      })
    )
    .subscribe({
      next: noop,
      error: err => this.errorMessage = err
    });
  }

	handleNewMeeting (): void {
    this.router.navigate(['meetings', 'create']);
  }

  handleDeleteMeeting (meetingId: number): void {
    this.meetingService.deleteMeeting(meetingId) //TODO: no cambia el hover cuando posicionamos el puntero arriba del icono
      .pipe(
        tap((result) => {
          this.notificationService.successNotification(
            'GeneralMessages.successNotificationTitle',
            'MeetingListComponent.delete.' + result.resultKeys
          );
          this.getMeetings();
        })
      )
      .subscribe({
        next: noop,
        error: (err) => {
          this.notificationService.failureNotification(
            'GeneralMessages.errorNotificationTitle',
            'MeetingListComponent.' + err.resultKeys
          );
        }
      })
  }

  ngOnDestroy(): void {
		this.sub.unsubscribe();
  }
}
