import { combineReducers } from 'redux';

import { SIGNOUT_USER } from '../user/user.types';
import { ADD_MESSAGE, UPDATE_MESSAGE } from './messages.types';

const allIds = (state = [], action) => {
  switch (action.type) {
    case ADD_MESSAGE.SUCCESS:
      return [...state, action.payload.id];
    default:
      return state;
  }
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case ADD_MESSAGE.SUCCESS:
      return { ...state, [action.payload.id]: action.payload };
    case SIGNOUT_USER.SUCCESS:
      return {};
    case UPDATE_MESSAGE.SUCCESS:
      return { ...state, [action.payload.id]: { ...state[action.payload.id], ...action.payload } };
    default:
      return state;
  }
};

const reducerMessages = combineReducers({
  allIds,
  byId,
});

export default reducerMessages;
