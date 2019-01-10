import { SIGNOUT_USER } from '../user/user.types';
import { ADD_MESSAGE } from './messages.types';

const initialState = [];

const reducerMessages = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSAGE.SUCCESS:
      return [...state, action.payload];
    case SIGNOUT_USER.SUCCESS:
      return [];
    default:
      return state;
  }
};

export default reducerMessages;
