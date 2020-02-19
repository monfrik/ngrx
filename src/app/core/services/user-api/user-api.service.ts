import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { UserModel } from '@app/users/models/user.model';


const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const USERS_URL = 'api/users';

@Injectable({
  providedIn: 'root',
})

export class UserApiService {

  constructor(
    private readonly _http: HttpClient
  ) {}

  public getUsers(): Observable<UserModel[]> {
    return this._http
      .get<UserModel[]>(USERS_URL)
      .pipe(
        map((users: any) => {
          if (!users) {
            return [];
          }
          return users.map(item => new UserModel(item));
        })
      );
  }

  public getUser(id: string): Observable<UserModel> {
    return this._http
      .get<UserModel>(USERS_URL+'/'+id)
      .pipe(
        map((user: any) => {
          return new UserModel(user);
        })
      );
  }

  public addUser(user: UserModel): Observable<UserModel> {
    return this._http
      .post<UserModel>(USERS_URL, user, HTTP_OPTIONS);
  }

  public updateUser(user: UserModel): Observable<UserModel> {
    return this._http
      .put<UserModel>(USERS_URL, user, HTTP_OPTIONS);
  }

}
