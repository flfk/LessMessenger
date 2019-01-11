import _ from 'lodash';
import { SIGNOUT_USER } from '../user/user.types';
import { ADD_MESSAGE, UPDATE_MESSAGE } from './messages.types';

const initialState = [];

const reducerMessages = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSAGE.SUCCESS:
      return [...state, action.payload];
    case SIGNOUT_USER.SUCCESS:
      return [];
    case UPDATE_MESSAGE.SUCCESS:
      return state.map((msg, index) => {
        // console.log(_.findIndex(state, { id: action.payload.id }));
        if (_.findIndex(state, { id: action.payload.id }) === index) {
          // console.log('this is the message', msg);
          return action.payload;
        }
        return msg;
      });
    default:
      return state;
  }
};

export default reducerMessages;
