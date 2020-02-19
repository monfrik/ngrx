import { EUserActions } from '../actions';
import { UserActions } from '../actions';
import { initialUserState, IUserState } from '../state';
import { UserModel } from '@app/users/models';

export const userReducers = (
  state = initialUserState,
  action: UserActions
): IUserState => {
  switch (action.type) {
    case EUserActions.GetUsersSuccess: {
      return {
        ...state,
        users: action.payload,
      };
    }
    
    case EUserActions.GetUserSuccess: {
      return {
        ...state,
        selectedUser: action.payload,
        editedUser: {
          data: action.payload,
          source: 'state'
        }
      }
    }

    case EUserActions.PatchEditedUser: {
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

    case EUserActions.UpdateSelectedUserSuccess: {
      const users = state.users.map(element => {
        return element.id === action.payload.id
        ? action.payload
        : element
      })
      
      return {
        ...state,
        users,
        editedUser: {data: null, source: 'state'},
        selectedUser: null,
      }
    }

    default:
      return state
  }
};