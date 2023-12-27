import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Resource } from './rest.resources';
import { Observable, map } from 'rxjs';
import { BaseEntity } from '../models/base-entity.model';

@Injectable({
  providedIn: 'root'
})
export class RestService<T extends BaseEntity> {
  private readonly baseUrl = environment.API_URL;
  private readonly url: string;

  constructor(
    private readonly http: HttpClient,
    private readonly resource: Resource
  ) {
    this.url = `${this.baseUrl}/${this.resource}`
  }

  protected buildURL(): string {
    return `${this.baseUrl}/${this.resource}`;
  }

  all(): Observable<Array<T>> {
    return this.http.get<Array<T>>(this.buildURL())
      .pipe(
        map(response => this.mapArray(response))
      );
  }

  mapArray(value: any): Array<T> {
    return value.data.result;
  }
}
