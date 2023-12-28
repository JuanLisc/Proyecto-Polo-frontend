import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserEntity } from '../../../core/models/user-entity.model';
import { UserService } from '../../../core/rest/services/user.service';
import { Router } from '@angular/router';
import { Subscription, noop, tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  usersList: UserEntity[] = [];
  sub!: Subscription;
  errorMessage!: string;
  columnsToDisplay = ['email', 'firstName', 'lastName', 'role'];

  constructor (
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly translateService: TranslateService
  ) {}

  ngOnInit (): void {
    this.sub = this.getUsers();
  }

  getUsers (): Subscription {
    return this.userService.getUsers().pipe(
      tap(data => {
        this.usersList = data
      })
    ).subscribe({
      next: noop,
      error: err => this.errorMessage = err
    });
  }

  handleNewUser (): void {
    this.router.navigate(['users', 'create']);
  }

  ngOnDestroy (): void { 
    this.sub.unsubscribe;
  }
}
