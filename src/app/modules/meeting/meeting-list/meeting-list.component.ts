import { Component, OnDestroy, OnInit } from '@angular/core';
import { MeetingEntity } from '../../../core/models/meeting-entity.model';
import { Subscription, noop, tap } from 'rxjs';
import { MeetingService } from '../../../core/rest/services/meeting.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { MeetingCreateComponent } from '../meeting-create/meeting-create.component';
import { FormControl } from '@angular/forms';
import { format } from 'date-fns';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent implements OnInit, OnDestroy {
  meetingsList: MeetingEntity[] = [];
  sub!: Subscription;
  errorMessage!: string;
	columnsToDisplay = ['detail', 'date', 'hour', 'duration', 'actions'];
	queryDateControl = new FormControl();
	meetingModalConfig = {
    hasBackdrop: true,
    backdropClass: 'st-dialog-backdrop',
    width: `${Math.min(window.innerWidth / 2, 500)}px`,
    borderRadius: '50%'
  };

  constructor (
    private readonly meetingService: MeetingService,
    private readonly notificationService: NotificationService,
		private readonly matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sub = this.getMeetings(this.queryDateControl.value);
  }

  getMeetings (queryDate?: Date): Subscription {
    return this.meetingService.getMeetings(queryDate).pipe(
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
    this.matDialog
			.open(
				MeetingCreateComponent,
				this.meetingModalConfig
			)
			.afterClosed()
			.pipe(
				tap(value => {
					if (value) this.getMeetings();
				})
			)
			.subscribe();
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

	setDayFilter (): void {
		this.getMeetings(this.queryDateControl.value);
	}

  formatDate (date: Date): string {
    return format(date, 'dd-MM-yyyy');
  }

	onCancel (): void {
		this.getMeetings();
	}

  ngOnDestroy(): void {
		this.sub.unsubscribe();
  }
}
