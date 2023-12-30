import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MeetingEntity } from '../../models/meeting-entity.model';
import { environment } from '../../../../environments/environment';
import { Observable, catchError, map, throwError } from 'rxjs';
import { MeetingCreateDTO } from '../../../modules/meeting/dtos/meeting-create.dto';

interface IMeetingResponse {
  data: {
    result: MeetingEntity | MeetingEntity[],
    count?: number
  },
  resultKeys: string[]
}

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private readonly baseUrl = environment.API_URL;
  private readonly MEETINGS = 'meetings';

  constructor(
    private readonly http: HttpClient
  ) {}

  getMeetings (): Observable<MeetingEntity[]> {
    return this.http.get<any>(`${this.baseUrl}/${this.MEETINGS}`)
      .pipe(
        map(response => response.data.result),
        catchError(err => throwError(() => new Error(err)))
      )
  }

  getMeeting (id: number): Observable<MeetingEntity> {
    return this.http.get<any>(`${this.baseUrl}/${this.MEETINGS}/${id}`)
      .pipe(
        map(response => response.data.result)
      )
  }

  createMeeting (newMeeting: MeetingCreateDTO): Observable<IMeetingResponse> {
    return this.http.post<any>(`${this.baseUrl}/${this.MEETINGS}/`, newMeeting)
      .pipe(
        map(response => response)
      )
  }

  deleteMeeting (id: number): Observable<IMeetingResponse> {
    return this.http.delete<any>(`${this.baseUrl}/${this.MEETINGS}/${id}`)
      .pipe(
        map(response => response)
      )
  }
}
