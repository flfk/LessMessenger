import { MESSAGES_PER_LOAD } from '../../utils/Constants';
import { db, dbTimestamp, firestore, storage } from '../firebase';
import { getTags } from '../../utils/Helpers';
import { addTag } from '../tags/tags.actions';
import {
  ADD_MESSAGE,
  CANCEL_REPLY,
  LOAD_MESSAGES,
  SEND_MESSAGE,
  REPLY_TO_MESSAGE,
  UPDATE_MESSAGE,
} from './messages.types';

const COLL_MESSAGES = 'messages';

export const addMessage = msg => dispatch => {
  dispatch({
    type: ADD_MESSAGE.SUCCESS,
    payload: msg,
  });
  if (!msg.isAttachment) {
    const tags = getTags(msg.content);
    tags.map(tagName => dispatch(addTag(tagName)));
  }
};

export const cancelReply = () => dispatch => {
  dispatch({
    type: CANCEL_REPLY.SUCCESS,
  });
};

export const sendMessage = msg => async dispatch => {
  try {
    await db
      .collection(COLL_MESSAGES)
      .add({ ...msg, timestamp: firestore.FieldValue.serverTimestamp() });
    dispatch({
      type: SEND_MESSAGE.SUCCESS,
    });
  } catch (error) {
    console.log('Error Actions, messages, sendMessage', error);
    dispatch({
      type: SEND_MESSAGE.ERROR,
    });
  }
};

export const updateMessage = msg => dispatch => {
  dispatch({
    type: UPDATE_MESSAGE.SUCCESS,
    payload: msg,
  });
  if (!msg.isAttachment) {
    const tags = getTags(msg.content);
    tags.map(tagName => dispatch(addTag(tagName)));
  }
};

export const replyToMsg = msgID => dispatch => {
  console.log('replying to msg', msgID);
  dispatch({
    type: REPLY_TO_MESSAGE.SUCCESS,
    payload: msgID,
  });
};

export const getMessageSubscription = roomID => async dispatch => {
  dispatch({
    type: LOAD_MESSAGES.PENDING,
  });
  let subscription = null;
  try {
    subscription = await db
      .collection(COLL_MESSAGES)
      .where('roomID', '==', roomID)
      .orderBy('timestamp', 'desc')
      .limit(MESSAGES_PER_LOAD)
      .onSnapshot(snapshot => {
        // If snapshot for changes required need to add new change type
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const { doc } = change;
            const msg = doc.data();
            const { id } = doc;
            msg.id = id;
            // convert firestore timestamp to unix
            // console.log('about to add message', msg);
            msg.timestamp = msg.timestamp ? msg.timestamp.toMillis() : dbTimestamp.now().toMillis();
            dispatch(addMessage(msg));
          }
          if (change.type === 'modified') {
            // will be modified when the timestamp updates
            const { doc } = change;
            const msg = doc.data();
            const { id } = doc;
            msg.id = id;
            msg.timestamp = msg.timestamp.toMillis();
            // console.log('modified', msg);
            dispatch(updateMessage(msg));
          }
        });
      });
    dispatch({
      type: LOAD_MESSAGES.SUCCESS,
    });
  } catch (error) {
    console.log('Actions, messages, getMessageSubscription', error);
    dispatch({
      type: LOAD_MESSAGES.ERROR,
    });
  }
  return subscription;
};

export const uploadFile = async (file, roomID) => {
  try {
    const timestamp = dbTimestamp.now().toMillis();
    const uploadTask = storage
      .ref()
      .child(`${roomID}/${timestamp}_${file.name}`)
      .put(file);

    uploadTask.on('state_changed', {
      complete: () => uploadTask.snapshot.ref,
    });

    return uploadTask;
  } catch (error) {
    console.log('messages.actions, messages, uploadFile', error);
  }
};

const updateDocMsg = async (msgId, fields) => {
  const msgRef = db.collection(COLL_MESSAGES).doc(msgId);
  await msgRef.update({ ...fields });
};

export const togglePinMsg = (isPinned, msgId) => async dispatch => {
  try {
    const isPinnedUpdated = !isPinned;

    dispatch({
      type: UPDATE_MESSAGE.SUCCESS,
      payload: { id: msgId, isPinned: isPinnedUpdated },
    });
  } catch (error) {
    console.log('messages.actions, messages, togglePinMsg', error);
  }
};
