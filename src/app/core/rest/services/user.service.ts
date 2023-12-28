import { Injectable } from '@angular/core';
import { UserEntity } from '../../models/user-entity.model';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { UserCreateDTO } from '../../../modules/user/dtos/user-create.dto';
import { AuthService } from './auth.service';
import { UserUpdateDTO } from '../../../modules/user/dtos/user-update.dto';

interface IUserResponse {
  data: {
    result: UserEntity | UserEntity[],
    count?: number
  },
  resultKeys: string[]
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = environment.API_URL;
  private readonly USERS = 'users';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  getUsers (): Observable<UserEntity[]> {
    return this.http.get<any>(`${this.baseUrl}/${this.USERS}`)
      .pipe(
        map(response => response.data.result),
        catchError(err => throwError(() => new Error(err)))
      )
  }

  getUser (id: string): Observable<UserEntity> {
    return this.http.get<any>(`${this.baseUrl}/${this.USERS}/${id}`)
      .pipe(
        map(response => response.data.result)
      )
  }

  createUser (newUser: UserCreateDTO): Observable<IUserResponse> {
    return this.http.post<any>(`${this.baseUrl}/${this.USERS}/`, newUser)
      .pipe(
        map(response => response)
      )
  }

  deleteUser (id: string): Observable<IUserResponse> {
    return this.http.delete<any>(`${this.baseUrl}/${this.USERS}/${id}`)
      .pipe(
        map(response => response)
      )
  }

  updateUser (id: number, user: UserUpdateDTO): Observable<IUserResponse> {
    return this.http.put<any>(`${this.baseUrl}/${this.USERS}/${id}`, user)
      .pipe(
        map((response) => {
          this.authService.updateCurrentUser(response.data.result);
          return response;
        })
      )
  }
}
