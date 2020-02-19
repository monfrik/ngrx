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
        editedUser: {
          data: action.payload,
          source: 'state'
        }
      }
    }

    case EUserActions.PatchEditedUser: {
      return {
        ...state,
        editedUser: {
          data: {
            ...state.editedUser.data,
            ...action.payload.data
          },
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
      
      console.log({
        ...state,
        users,
        editedUser: null,
        selectedUser: null,
      })
      return {
        ...state,
        users,
        editedUser: null,
        selectedUser: null,
      }
    }

    default:
      return state
  }
};