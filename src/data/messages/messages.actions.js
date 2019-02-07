import { MESSAGES_PER_LOAD } from '../../utils/Constants';
import { db, dbTimestamp, firebase, storage } from '../firebase';
// import { getTags } from '../../utils/Helpers';
import {
  ADD_MESSAGE,
  ALL_MESSAGES_LOADED,
  DELETE_MSG,
  CANCEL_REPLY,
  LOADING_MESSAGES,
  SEND_MESSAGE,
  SET_LAST_MSG_DOC,
  REPLY_TO_MESSAGE,
  UPDATE_MESSAGE,
} from './messages.types';
// import { createTag, updateDateLastUsed } from '../tags/tags.actions';

const COLL_MESSAGES = 'messages';

export const addMessage = msg => dispatch => {
  dispatch({
    type: ADD_MESSAGE.SUCCESS,
    payload: msg,
  });
};

const updateDocMsg = async (id, fields) => {
  const msgRef = db.collection(COLL_MESSAGES).doc(id);
  await msgRef.update({ ...fields });
};

export const updateLastMsgDoc = doc => dispatch => {
  dispatch({
    type: SET_LAST_MSG_DOC.SUCCESS,
    payload: doc,
  });
};

export const updateMsgInState = msg => dispatch => {
  dispatch({
    type: UPDATE_MESSAGE.SUCCESS,
    payload: msg,
  });
};

export const cancelReply = () => dispatch => {
  console.log('messages.actions cancel reply');
  dispatch({
    type: CANCEL_REPLY.SUCCESS,
  });
};

export const deleteMsg = id => async dispatch => {
  try {
    await db
      .collection(COLL_MESSAGES)
      .doc(id)
      .delete();
  } catch (error) {
    console.log('Error, messages.actions, deleteDocMsg', error);
  }
};

// export const editMsg = (msg, tags) => async dispatch => {
export const editMsg = msg => async dispatch => {
  // const tagIds = await getTagIds(msg.content, msg.roomId, tags);
  // tags.forEach(tag => {
  //   dispatch(updateDateLastUsed(tag));
  // });
  // const msgUpdated = { ...msg, tagIds };
  // dispatch(updateMsgInState(msgUpdated));
  // await updateDocMsg(msg.id, { content: msg.content, tagIds });
  dispatch(updateMsgInState(msg));
  await updateDocMsg(msg.id, { content: msg.content });
};

export const toggleSaveMsg = (msg, userId) => async dispatch => {
  const { savesByUserId } = msg;
  const msgUpdated = { ...msg };
  if (!savesByUserId) {
    msgUpdated.savesByUserId = [userId];
  } else if (savesByUserId && savesByUserId.indexOf(userId) > -1) {
    msgUpdated.savesByUserId = msg.savesByUserId.filter(id => id !== userId);
  } else {
    msgUpdated.savesByUserId = [...msg.savesByUserId, userId];
  }

  updateDocMsg(msg.id, { savesByUserId: msgUpdated.savesByUserId });
  dispatch(updateMsgInState(msgUpdated));
};

export const replyToMsg = msgId => dispatch => {
  dispatch({
    type: REPLY_TO_MESSAGE.SUCCESS,
    payload: msgId,
  });
};

export const sendMessage = msg => async dispatch => {
  try {
    await db
      .collection(COLL_MESSAGES)
      .add({ ...msg, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
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

export const uploadFile = async (file, roomId) => {
  try {
    const timestamp = dbTimestamp.now().toMillis();
    const uploadTask = storage
      .ref()
      .child(`${roomId}/${timestamp}_${file.name}`)
      .put(file);

    uploadTask.on('state_changed', {
      complete: () => uploadTask.snapshot.ref,
    });

    return uploadTask;
  } catch (error) {
    console.log('messages.actions, messages, uploadFile', error);
  }
};

export const markMsgAsSeen = async (id, userId) => {
  try {
    const msgRef = db.collection(COLL_MESSAGES).doc(id);
    msgRef.update({ seenByUserId: firebase.firestore.FieldValue.arrayUnion(userId) });
  } catch (error) {
    console.log('messages.actions, messages, markMsgAsSeen', error);
  }
};

// SUBSCRIPTIONS

const handleMsgSnapshot = (dispatch, userId) => async snapshot => {
  if (snapshot.empty) {
    dispatch({
      type: ALL_MESSAGES_LOADED.SUCCESS,
    });
  }
  const messagesAdded = [];
  const messagesUpdated = [];
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      const { doc } = change;
      const msg = doc.data();
      const { id } = doc;
      msg.id = id;
      // Mark as seen if not already marked as seen
      // if (!msg.seenByUserId || !(msg.seenByUserId.indexOf(userId) > -1)) markMsgAsSeen(id, userId);
      // convert firestore timestamp to unix
      // console.log('snapshot event change add', msg);
      msg.timestamp =
        msg.timestamp && msg.timestamp.toMillis
          ? msg.timestamp.toMillis()
          : dbTimestamp.now().toMillis();
      messagesAdded.push(msg);
      // dispatch(addMessage(msg));
      // update last Msg Doc to be used as reference for following load

      console.log('added', doc.data());
      dispatch(updateLastMsgDoc(doc));
    }
    if (change.type === 'modified') {
      // will be modified when the timestamp updates
      const { doc } = change;
      const msg = doc.data();
      const { id } = doc;
      msg.id = id;
      // console.log('snapshot event change modified', msg);
      msg.timestamp =
        msg.timestamp && msg.timestamp.toMillis
          ? msg.timestamp.toMillis()
          : dbTimestamp.now().toMillis();
      // console.log('modified', msg);
      // dispatch(updateMsgInState(msg));

      // Don't update any changes in who has seen message so it isn't filtered out in selector
      const msgUpdated = { ...msg };
      if (msgUpdated.seenByUserId) delete msgUpdated.seenByUserId;
      messagesUpdated.push(msgUpdated);
      console.log('modified', doc.data());
      // dispatch(updateLastMsgDoc(doc));
    }
    if (change.type === 'removed') {
      const { doc } = change;
      const msg = doc.data();
      const { id } = doc;
      msg.id = id;
      // console.log('snapshot event change removed', msg);
      dispatch({
        type: DELETE_MSG.SUCCESS,
        payload: msg,
      });
    }
  });
  messagesAdded.map(msg => dispatch(addMessage(msg)));
  messagesUpdated.map(msg => dispatch(updateMsgInState(msg)));
  // console.log('all messages loaded', messagesAdded.length, messagesUpdated.length);
  dispatch({
    type: LOADING_MESSAGES.SUCCESS,
  });
};

export const getMsgSubscription = (roomId, lastMsgDoc, userId) => async dispatch => {
  let subscription = null;
  try {
    const msgRef = db
      .collection(COLL_MESSAGES)
      .where('roomId', '==', roomId)
      .orderBy('timestamp', 'desc');
    const msgRefLimited = lastMsgDoc
      ? msgRef.startAfter(lastMsgDoc).limit(MESSAGES_PER_LOAD)
      : msgRef.limit(MESSAGES_PER_LOAD);
    subscription = msgRefLimited.onSnapshot(handleMsgSnapshot(dispatch, userId));
  } catch (error) {
    console.log('messages.actions, getMsgSubscription', error);
  }
  return subscription;
};
