import { MESSAGES_PER_LOAD } from '../../utils/Constants';
import { db } from '../firebase';
import { ADD_MESSAGE, LOAD_MESSAGES, SEND_MESSAGE } from './messages.types';

const COLL_MESSAGES = 'messages';

export const addMessage = msg => dispatch => {
  dispatch({
    type: ADD_MESSAGE.SUCCESS,
    payload: msg,
  });
};

export const sendMessage = msg => async dispatch => {
  console.log('sending message');
  try {
    await db.collection(COLL_MESSAGES).add(msg);
    dispatch({
      type: SEND_MESSAGE.SUCCESS,
    });
  } catch (error) {
    console.log('Actions, messages, addMessage');
    dispatch({
      type: SEND_MESSAGE.ERROR,
    });
  }
};

export const loadMessages = roomID => async dispatch => {
  dispatch({
    type: LOAD_MESSAGES.PENDING,
  });
  try {
    const messagesRef = db.collection(COLL_MESSAGES).where('roomID', '==', roomID);
    await messagesRef
      .orderBy('timestamp')
      .limit(MESSAGES_PER_LOAD)
      .onSnapshot(snapshot => {
        // If snapshot for changes required need to add new change type
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const { doc } = change;
            const msg = doc.data();
            const { id } = doc;
            msg.id = id;
            dispatch(addMessage(msg));
          }
        });
        dispatch({
          type: LOAD_MESSAGES.SUCCESS,
        });
        // }
      });
  } catch (error) {
    console.log('Actions, messages, loadMessages');
    dispatch({
      type: LOAD_MESSAGES.ERROR,
    });
  }
};
