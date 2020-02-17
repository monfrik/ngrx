import { Action } from '@ngrx/store';

import { UserModel } from '@app/users/models';


export enum EUserActions {
  GetUsers = '[User] Get Users',
  GetUsersSuccess = '[User] Get Users Success',
  GetUser = '[User] Get User',
  GetUserSuccess = '[User] Get User Success',
  GetEditedUser = '[User] Get Edited User',
  PatchEditedUser = '[User] Patch Edited User',
}

export class GetUsers implements Action {
  public readonly type = EUserActions.GetUsers;
}

export class GetUsersSuccess implements Action {
  public readonly type = EUserActions.GetUsersSuccess;

  constructor (public payload: UserModel[]){}
}

export class GetUser implements Action {
  public readonly type = EUserActions.GetUser;

  constructor (public payload: number){}
}

export class GetUserSuccess implements Action {
  public readonly type = EUserActions.GetUserSuccess;

  constructor (public payload: UserModel){}
}

export class GetEditedUser implements Action {
  public readonly type = EUserActions.GetEditedUser;
}

export class PatchEditedUser implements Action {
  public readonly type = EUserActions.PatchEditedUser;

  constructor (public payload: {[key: string]: any}){}
}

export type UserActions = GetUsers | GetUsersSuccess | GetUser | GetUserSuccess | GetEditedUser | PatchEditedUser;