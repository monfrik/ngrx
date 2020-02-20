import { UserAction, UserActionList } from '../actions';
import { initialUserState, IUserState } from '../state';
import { UserModel } from '@app/users/models';

export const userReducers = (
  state = initialUserState,
  action: UserActionList,
): IUserState => {
  switch (action.type) {
    case UserAction.FetchUsers: {
      return {
        ...state,
        users: action.payload,
      };
    }
    
    case UserAction.FetchUser: {
      return {
        ...state,
        selectedUser: action.payload,
        editedUser: {
          data: action.payload,
          source: 'state'
        }
      }
    }

    case UserAction.PatchEditedUser: {
      let editedUser: UserModel;

      if (action.payload.data === null) {
        editedUser = null
      }

      if (action.payload.data === undefined) {
        if (state.editedUser.data) {
          editedUser = {...state.editedUser.data};
        } else {
          editedUser = null;
        }
      }

      if (action.payload.data) {
        editedUser = {
          ...state.editedUser.data,
          ...action.payload.data
        }
      }
      
      return {
        ...state,
        editedUser: {
          data: editedUser,
          source: action.payload.source
        },
      }
    }

    case UserAction.SaveSelectedUser: {
      return {
        ...state,
        editedUser: {data: null, source: 'state'},
        selectedUser: null,
      }
    }

    default:
      return state
  }
};