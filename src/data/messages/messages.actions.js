import { MESSAGES_PER_LOAD } from '../../utils/Constants';
import { db, dbTimestamp, firestore, storage } from '../firebase';
import { getTags } from '../../utils/Helpers';
import {
  ADD_MESSAGE,
  ALL_MESSAGES_LOADED,
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

const updateLastMsgDoc = doc => dispatch => {
  dispatch({
    type: SET_LAST_MSG_DOC.SUCCESS,
    payload: doc,
  });
};

export const loadMessages = (lastMsgDoc, roomId) => async dispatch => {
  try {
    const messagesRef = db
      .collection(COLL_MESSAGES)
      .where('roomId', '==', roomId)
      .orderBy('timestamp', 'desc')
      .startAfter(lastMsgDoc)
      .limit(MESSAGES_PER_LOAD);

    const snapshot = await messagesRef.get();

    if (snapshot.empty) {
      dispatch({
        type: ALL_MESSAGES_LOADED.SUCCESS,
      });
      return;
    }

    let msg = null;
    snapshot.forEach(doc => {
      msg = doc.data();
      const { id } = doc;
      msg.id = id;
      msg.timestamp = msg.timestamp.toMillis();
      dispatch(addMessage(msg));
    });

    const lastMsgDocUpdated = snapshot.docs[snapshot.docs.length - 1];
    dispatch(updateLastMsgDoc(lastMsgDocUpdated));
  } catch (error) {
    console.log('Error messages.actions, loadMessages', error);
    dispatch({
      type: LOAD_MESSAGES.ERROR,
    });
  }
};

export const replyToMsg = msgId => dispatch => {
  dispatch({
    type: REPLY_TO_MESSAGE.SUCCESS,
    payload: msgId,
  });
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
      console.log('msg actions, newTag', newTag);
      return newTag.id;
    })
  );
  console.log('tagIds', tagIds);
  return tagIds;
};

export const sendMessage = (msg, tags) => async dispatch => {
  try {
    console.log('sendMessage tags', tags);
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

const updateDocMsg = async (id, fields) => {
  const msgRef = db.collection(COLL_MESSAGES).doc(id);
  await msgRef.update({ ...fields });
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

export const updateMsgInState = msg => dispatch => {
  dispatch({
    type: UPDATE_MESSAGE.SUCCESS,
    payload: msg,
  });
};

export const getMessageSubscription = roomId => async dispatch => {
  dispatch({
    type: LOAD_MESSAGES.PENDING,
  });
  let subscription = null;
  try {
    subscription = await db
      .collection(COLL_MESSAGES)
      .where('roomId', '==', roomId)
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

export const editMsg = (msg, tags) => async dispatch => {
  const tagIds = await getTagIds(msg.content, msg.roomId, tags);
  tags.forEach(tag => {
    dispatch(updateDateLastUsed(tag));
  });
  const msgUpdated = { ...msg, tagIds };
  dispatch(updateMsgInState(msgUpdated));
  await updateDocMsg(msg.id, { content: msg.content, tagIds });
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
