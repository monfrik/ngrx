import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { UserApiService } from '@core/services';
import { UserModel } from '../../models';


@Injectable()

export class UsersService {

  public users;
  public userFormData$ = new Subject<{userData: UserModel, source: 'stepper' | 'list' | 'service'}>();

  public constructor(
    private readonly _userApiService: UserApiService,
  ) {}

  public getUsers(): Observable<UserModel[]> {
    return this._userApiService
      .getUsers();
  }

  public getUser(id: string): Observable<UserModel> {
    return this._userApiService
      .getUser(id);
  }

  public addUser(data: UserModel): Observable<UserModel> {
    return this._userApiService
      .addUser(data);
  }

}
