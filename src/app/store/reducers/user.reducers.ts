import { UserAction, UserActionList } from '../actions';
import { initialUserState, IUserState } from '../state';
import { routerFilter } from '../helpers';
import { UserModel } from '@app/users/models';

export const userReducers = (
  state = initialUserState,
  action: UserActionList,
): IUserState => {
  switch (action.type) {

    case UserAction.FetchUsers: {
      console.log('fetch');
      const users = routerFilter(action.payload.users || [], action.payload.filtres);
      return {
        ...state,
        users,
      };
    }
    case UserAction.FetchUser: {
      return {
        ...state,
        editedUser: action.payload,
      }
    }

    case UserAction.PatchEditedUser: {
      let editedUser: UserModel;

      if (action.payload === null) {
        editedUser = null
      }

      if (action.payload) {
        editedUser = {
          ...state.editedUser,
          ...action.payload
        }
      }
      
      return {
        ...state,
        editedUser,
      }
    }

    case UserAction.SaveEditedUser: {
      return {
        ...state,
        editedUser: null,
      }
    }

    case UserAction.ClearEditedUser: {
      return {
        ...state,
        editedUser: null,
      }
    }

    default:
      return state
  }
};