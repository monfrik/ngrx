import { UserModel } from '@app/users/models';


export interface EditedUserPayload {
  data: {
    [key: string]: any,
  };
  source: UserEditSource;
}

export interface EditedUser {
  data: UserModel;
  source: UserEditSource;
}

export type UserEditSource = 'list' | 'stepper' | 'state';
