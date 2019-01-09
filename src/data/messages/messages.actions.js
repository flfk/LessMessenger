import { addDocMessage, fetchDocsMessages } from './messages.api';
import { ADD_MESSAGE, GET_MESSAGES } from './messages.types';

export const addMessage = msg => async dispatch => {
  try {
    dispatch({
      type: ADD_MESSAGE.SUCCESS,
      payload: msg,
    });
    await addDocMessage(msg);
  } catch (error) {
    console.log('Actions, messages, addMessage');
    dispatch({
      type: ADD_MESSAGE.ERROR,
    });
  }
};

export const getMessages = roomID => async dispatch => {
  try {
    const messages = await fetchDocsMessages(roomID);
    dispatch({
      type: GET_MESSAGES.SUCCESS,
      payload: messages,
    });
  } catch (error) {
    console.log('Actions, messages, getMessages');
    dispatch({
      type: GET_MESSAGES.ERROR,
    });
  }
};
