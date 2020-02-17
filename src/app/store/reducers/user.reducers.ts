import { EUserActions } from '../actions';
import { UserActions } from '../actions';
import { initialUserState, IUserState } from '../state';

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
        editedUser: action.payload,
      }
    }

    case EUserActions.PatchEditedUser: {
      return {
        ...state,
        editedUser: Object.assign(state.editedUser, action.payload),
      }
    }

    default:
      return state
  }
};