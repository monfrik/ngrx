import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, map, withLatestFrom, tap } from 'rxjs/operators';

import { IAppState } from '../state';
import {
  EUserActions,
  GetUsers,
  GetUsersSuccess,
  GetUser,
  GetUserSuccess,
  UpdateSelectedUser,
  UpdateSelectedUserSuccess
} from '../actions';
import { UserApiService } from '@core/services';
import { selectUserList } from '../selectos';
import { UserModel } from '@app/users/models';


@Injectable()
export class UserEffects {
  @Effect()
  public getUser$ = this._actions$.pipe(
    ofType<GetUser>(EUserActions.GetUser),
    map(action => action.payload),
    withLatestFrom(this._store.pipe(select(selectUserList))),
    map(([id, users = []]) => {
      const selectedUser = users.filter(user => user.id === +id)[0];
      return new GetUserSuccess(selectedUser);
    })
  );

  @Effect()
  public getUsers$ = this._actions$.pipe(
    ofType<GetUsers>(EUserActions.GetUsers),
    switchMap(() => this._usersService.getUsers()),
    map((users: UserModel[]) => new GetUsersSuccess(users))
  )

  @Effect()
  public updateSelectedUser$ = this._actions$.pipe(
    ofType<UpdateSelectedUser>(EUserActions.UpdateSelectedUser),
    map(action => action.payload),
    switchMap((user: UserModel) => this._usersService.updateUser(user)),
    map((data: UserModel) => new UpdateSelectedUserSuccess(data))
  )

  constructor (
    private readonly _usersService: UserApiService,
    private readonly _actions$: Actions,
    private readonly _store: Store<IAppState>
  ) {}
}