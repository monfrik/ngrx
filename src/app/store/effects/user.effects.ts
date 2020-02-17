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
  GetUserSuccess
} from '../actions';
import { UsersService } from '@app/users/services';
import { selectUserList } from '../selectos';
import { UserModel } from '@app/users/models';


@Injectable()
export class UserEffects {
  @Effect()
  getUser$ = this._actions$.pipe(
    ofType<GetUser>(EUserActions.GetUser),
    map(action => action.payload),
    withLatestFrom(this._store.pipe(select(selectUserList))),
    switchMap(([id, users = []]) => {
      const selectedUser = users.filter(user => user.id === +id)[0];
      return of (new GetUserSuccess(selectedUser));
    })
  );

  @Effect()
  getUsers$ = this._actions$.pipe(
    ofType<GetUsers>(EUserActions.GetUsers),
    switchMap(() => this._usersService.getUsers()),
    switchMap((users: UserModel[]) => of(new GetUsersSuccess(users)))
  )

  constructor (
    private readonly _usersService: UsersService,
    private readonly _actions$: Actions,
    private readonly _store: Store<IAppState>
  ) {}
}