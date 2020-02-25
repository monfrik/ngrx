import { Injectable } from '@angular/core';

import { Effect, ofType, Actions } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';

import { of, concat } from 'rxjs';
import { switchMap, map, withLatestFrom, tap, concatMap } from 'rxjs/operators';

import { IAppState } from '../state';
import {
  UserAction,
  GetUsers,
  FetchUsers,
  GetUser,
  FetchUser,
  UpdateEditedUser,
  SaveEditedUser
} from '../actions';
import { selectUserList } from '../selectos';

import { UserApiService } from '@core/services';
import { UserModel } from '@app/users/models';
import { RouterParams } from '@app/core/interfaces';


@Injectable()
export class UserEffects {
  @Effect()
  public getUser$ = this._actions$.pipe(
    ofType<GetUser>(UserAction.GetUser),
    map((action) => action.payload),
    withLatestFrom(this._store.pipe(select(selectUserList))),
    switchMap(([id, users]) => {
      if (users) {
        return of(users.find(user => user.id == id));
      }
      return this._usersService.getUser(id);
    }),
    map((user: UserModel) => new FetchUser(user)),
  );

  @Effect()
  public getUsers$ = this._actions$.pipe(
    ofType<GetUsers>(UserAction.GetUsers),
    // tap(console.log),
    map((action) => action.payload),
    tap(console.log),
    withLatestFrom(this._usersService.getUsers()),
    // switchMap(() => this._usersService.getUsers()),
    tap(console.log),
    // withLatestFrom(of({})),
    // tap(console.log),


    // map(([filtres, users]) => new FetchUsers({users, filtres: filtres as RouterParams})),
  )

  @Effect()
  public UpdateEditedUser$ = this._actions$.pipe(
    ofType<UpdateEditedUser>(UserAction.UpdateEditedUser),
    map((action) => action.payload),
    switchMap((user: UserModel) => this._usersService.updateUser(user)),
    tap(() => this._store.dispatch(new GetUsers({}))),
    map(()=> new SaveEditedUser()),
  )

  constructor (
    private readonly _usersService: UserApiService,
    private readonly _actions$: Actions,
    private readonly _store: Store<IAppState>
  ) {}
}