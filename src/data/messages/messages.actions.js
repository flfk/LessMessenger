import {} from './messages.api';
import { ADD_MESSAGE } from './messages.types';

export const addMessage = message => async dispatch => {
  try {
    dispatch({
      type: ADD_MESSAGE.SUCCESS,
      payload: message,
    });
  } catch (error) {
    console.log('Actions, messages, addMessage');
    dispatch({
      type: ADD_MESSAGE.ERROR,
    });
  }
};
