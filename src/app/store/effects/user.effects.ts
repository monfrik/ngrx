import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { switchMap, map, withLatestFrom, tap } from 'rxjs/operators';

import { IAppState } from '../state';
import {
  UserAction,
  GetUsers,
  FetchUsers,
  GetUser,
  FetchUser,
  UpdateSelectedUser,
  SaveSelectedUser
} from '../actions';
import { selectUserList } from '../selectos';

import { UserApiService } from '@core/services';
import { UserModel } from '@app/users/models';


@Injectable()
export class UserEffects {
  @Effect()
  public getUser$ = this._actions$.pipe(
    ofType<GetUser>(UserAction.GetUser),
    map((action) => action.payload),
    switchMap((id: number) => this._usersService.getUser(id)),
    map((user: UserModel) => new FetchUser(user)),
  );

  @Effect()
  public getUsers$ = this._actions$.pipe(
    ofType<GetUsers>(UserAction.GetUsers),
    switchMap(() => this._usersService.getUsers()),
    map((users: UserModel[]) => new FetchUsers(users)),
  )

  @Effect()
  public updateSelectedUser$ = this._actions$.pipe(
    ofType<UpdateSelectedUser>(UserAction.UpdateSelectedUser),
    map((action) => action.payload),
    switchMap((user: UserModel) => this._usersService.updateUser(user)),
    tap(() => this._store.dispatch(new GetUsers())),
    map(()=> new SaveSelectedUser()),
  )

  constructor (
    private readonly _usersService: UserApiService,
    private readonly _actions$: Actions,
    private readonly _store: Store<IAppState>
  ) {}
}