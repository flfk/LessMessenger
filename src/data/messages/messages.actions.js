import { MESSAGES_PER_LOAD } from '../../utils/Constants';
import { db, dbTimestamp, firestore, storage } from '../firebase';
import { getTags } from '../../utils/Helpers';
import {
  ADD_MESSAGE,
  ALL_MESSAGES_LOADED,
  DELETE_MSG,
  CANCEL_REPLY,
  LOAD_MESSAGES,
  SEND_MESSAGE,
  SET_LAST_MSG_DOC,
  REPLY_TO_MESSAGE,
  UPDATE_MESSAGE,
} from './messages.types';
import { createTag, updateDateLastUsed } from '../tags/tags.actions';

const COLL_MESSAGES = 'messages';

export const addMessage = msg => dispatch => {
  dispatch({
    type: ADD_MESSAGE.SUCCESS,
    payload: msg,
  });
};

export const cancelReply = () => dispatch => {
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

export const editMsg = (msg, tags) => async dispatch => {
  const tagIds = await getTagIds(msg.content, msg.roomId, tags);
  tags.forEach(tag => {
    dispatch(updateDateLastUsed(tag));
  });
  const msgUpdated = { ...msg, tagIds };
  dispatch(updateMsgInState(msgUpdated));
  await updateDocMsg(msg.id, { content: msg.content, tagIds });
};

const getTagIds = async (content, roomId, tags) => {
  const msgTags = getTags(content);
  const tagNames = tags.map(item => item.name);
  const tagIds = await Promise.all(
    msgTags.map(async tagName => {
      const tagIndex = tagNames.indexOf(tagName);
      if (tagIndex > -1) {
        return tags[tagIndex].id;
      }
      const newTag = await createTag(roomId, tagName);
      return newTag.id;
    })
  );
  // console.log('tagIds', tagIds);
  return tagIds;
};

export const replyToMsg = msgId => dispatch => {
  dispatch({
    type: REPLY_TO_MESSAGE.SUCCESS,
    payload: msgId,
  });
};

export const sendMessage = (msg, tags) => async dispatch => {
  try {
    const tagIds = await getTagIds(msg.content, msg.roomId, tags);
    tagIds.forEach(id => {
      const tag = tags.find(item => item.id === id);
      dispatch(updateDateLastUsed(tag));
    });
    await db
      .collection(COLL_MESSAGES)
      .add({ ...msg, tagIds, timestamp: firestore.FieldValue.serverTimestamp() });
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
export const togglePinMsg = (id, isPinned) => async dispatch => {
  try {
    const isPinnedUpdated = !isPinned;
    await updateDocMsg(id, { isPinned: isPinnedUpdated });
    dispatch({
      type: UPDATE_MESSAGE.SUCCESS,
      payload: { id, isPinned: isPinnedUpdated },
    });
  } catch (error) {
    console.log('messages.actions, messages, togglePinMsg', error);
  }
};

const updateDocMsg = async (id, fields) => {
  const msgRef = db.collection(COLL_MESSAGES).doc(id);
  await msgRef.update({ ...fields });
};

const updateLastMsgDoc = doc => dispatch => {
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

// SUBSCRIPTIONS

const handleMsgSnapshot = dispatch => snapshot => {
  if (snapshot.empty) {
    console.log('snapshot is empty, no more messages to load');
    dispatch({
      type: ALL_MESSAGES_LOADED.SUCCESS,
    });
  }
  snapshot.docChanges().forEach((change, index) => {
    if (index === 0) console.log('first msg in subscription is', change.doc.data());
    if (change.type === 'added') {
      const { doc } = change;
      const msg = doc.data();
      const { id } = doc;
      msg.id = id;
      // convert firestore timestamp to unix
      // console.log('about to add message', msg);
      msg.timestamp = msg.timestamp ? msg.timestamp.toMillis() : dbTimestamp.now().toMillis();
      dispatch(addMessage(msg));
      // update last Msg Doc to be used as reference for following load
      dispatch(updateLastMsgDoc(doc));
    }
    if (change.type === 'modified') {
      // will be modified when the timestamp updates
      const { doc } = change;
      const msg = doc.data();
      const { id } = doc;
      msg.id = id;
      msg.timestamp = msg.timestamp.toMillis();
      // console.log('modified', msg);
      dispatch(updateMsgInState(msg));
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
};

export const getMsgSubscription = (roomId, lastMsgDoc = null) => async dispatch => {
  let subscription = null;
  try {
    const msgRef = db
      .collection(COLL_MESSAGES)
      .where('roomId', '==', roomId)
      .orderBy('timestamp', 'desc');
    const msgRefLimited = lastMsgDoc
      ? msgRef.startAfter(lastMsgDoc).limit(MESSAGES_PER_LOAD)
      : msgRef.limit(MESSAGES_PER_LOAD);
    subscription = msgRefLimited.onSnapshot(handleMsgSnapshot(dispatch));
  } catch (error) {
    console.log('messages.actions, getMsgSubscription', error);
  }
  console.log('messages.actions, got subscription', subscription);
  return subscription;
};
