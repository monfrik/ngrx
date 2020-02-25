import { Action } from '@ngrx/store';

import { UserModel } from '@app/users/models';
import { RouterParams } from '@app/core/interfaces';

export enum UserAction {
  GetUsers = '[User] Get Users',
  FetchUsers = '[User] Get Users Success',
  GetUser = '[User] Get User',
  FetchUser = '[User] Get User Success',
  GetEditedUser = '[User] Get Edited User',
  PatchEditedUser = '[User] Patch Edited User',
  UpdateEditedUser = '[User] Update Edited User',
  SaveEditedUser = '[User] Save Edited User',
  ClearEditedUser = '[User] Clear Edited User',
}

export class GetUsers implements Action {
  public readonly type = UserAction.GetUsers;

  constructor (public payload: RouterParams){}
}

export class FetchUsers implements Action {
  public readonly type = UserAction.FetchUsers;

  constructor (public payload: {users: UserModel[], filtres: RouterParams}){}
}

export class GetUser implements Action {
  public readonly type = UserAction.GetUser;

  constructor (public payload: number){}
}

export class FetchUser implements Action {
  public readonly type = UserAction.FetchUser;

  constructor (public payload: UserModel){}
}

export class GetEditedUser implements Action {
  public readonly type = UserAction.GetEditedUser;
}

export class PatchEditedUser implements Action {
  public readonly type = UserAction.PatchEditedUser;

  constructor (public payload: UserModel){}
}

export class UpdateEditedUser implements Action {
  public readonly type = UserAction.UpdateEditedUser;

  constructor (public payload: UserModel){}
}

export class SaveEditedUser implements Action {
  public readonly type = UserAction.SaveEditedUser;
}

export class ClearEditedUser implements Action {
  public readonly type = UserAction.ClearEditedUser;
}

export type UserActionList =
GetUsers
| FetchUsers
| GetUser
| FetchUser
| GetEditedUser
| PatchEditedUser
| UpdateEditedUser
| ClearEditedUser
| SaveEditedUser;