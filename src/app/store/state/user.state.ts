import { UserModel } from '@app/users/models';
import { EditedUser } from '@core/interfaces';

export interface IUserState {
  users: UserModel[];
  selectedUser: UserModel;
  editedUser: EditedUser;
}

export const initialUserState: IUserState = {
  users: null,
  selectedUser: null,
  editedUser: null,
}
