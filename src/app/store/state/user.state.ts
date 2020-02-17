import { UserModel } from '@app/users/models';

export interface IUserState {
  users: UserModel[];
  selectedUser: UserModel;
  editedUser: UserModel;
}

export const initialUserState: IUserState = {
  users: null,
  selectedUser: null,
  editedUser: null,
}
