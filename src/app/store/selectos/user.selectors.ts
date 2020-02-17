import { createSelector } from '@ngrx/store';

import { IAppState } from '../state';
import { IUserState } from '../state';


const selectUsers = (state: IAppState) => state.users;

export const selectUserList = createSelector(
  selectUsers,
  (state: IUserState) => state.users
);

export const selectSelectedUser = createSelector(
  selectUsers,
  (state: IUserState) => state.selectedUser
);

