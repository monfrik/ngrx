import { UserModel } from '@app/users/models';

export interface IUserState {
  users: UserModel[];
  filteredUsers: UserModel[];
  editedUser: UserModel;
}

export const initialUserState: IUserState = {
  users: null,
  filteredUsers: null,
  editedUser: null,
}
