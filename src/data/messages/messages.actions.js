import { addDocMessage, messagesRef } from './messages.api';
import { ADD_MESSAGE, LOAD_MESSAGES } from './messages.types';

export const addMessage = msg => dispatch => {
  console.log('adding message');
  dispatch({
    type: ADD_MESSAGE.SUCCESS,
    payload: msg,
  });
};

export const sendMessage = msg => async dispatch => {
  console.log('sending message');
  try {
    dispatch(addMessage(msg));
    await addDocMessage(msg);
  } catch (error) {
    console.log('Actions, messages, addMessage');
    dispatch({
      type: ADD_MESSAGE.ERROR,
    });
  }
};

export const loadMessages = roomID => async dispatch => {
  console.log('loading message');
  try {
    await messagesRef.onSnapshot(snapshot => {
      console.log('new snapshot recieved');
      snapshot.forEach(doc => {
        const msg = doc.data();
        console.log('msg', msg);
        const { id } = doc;
        msg.id = id;
        dispatch(addMessage(msg));
      });
    });
    dispatch({
      type: LOAD_MESSAGES.SUCCESS,
    });
  } catch (error) {
    console.log('Actions, messages, loadMessages');
    dispatch({
      type: LOAD_MESSAGES.ERROR,
    });
  }
};
