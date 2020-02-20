import { Action } from '@ngrx/store';

import { UserModel } from '@app/users/models';
import { EditedUserPayload } from '@core/interfaces';

export enum UserAction {
  GetUsers = '[User] Get Users',
  FetchUsers = '[User] Get Users Success',
  GetUser = '[User] Get User',
  FetchUser = '[User] Get User Success',
  GetEditedUser = '[User] Get Edited User',
  PatchEditedUser = '[User] Patch Edited User',
  UpdateSelectedUser = '[User] Update Selected User',
  SaveSelectedUser = '[User] Update Selected User Success',
}

export class GetUsers implements Action {
  public readonly type = UserAction.GetUsers;
}

export class FetchUsers implements Action {
  public readonly type = UserAction.FetchUsers;

  constructor (public payload: UserModel[]){}
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

  constructor (public payload: EditedUserPayload){}
}

export class UpdateSelectedUser implements Action {
  public readonly type = UserAction.UpdateSelectedUser;

  constructor (public payload: UserModel){}
}

export class SaveSelectedUser implements Action {
  public readonly type = UserAction.SaveSelectedUser;
}

export type UserActionList = GetUsers 
| FetchUsers
| GetUser 
| FetchUser 
| GetEditedUser
| PatchEditedUser
| UpdateSelectedUser
| SaveSelectedUser;