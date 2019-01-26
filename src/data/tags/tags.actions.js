import { ADD_TAG, LOAD_TAGS, TOGGLE_TAG, UPDATE_TAG } from './tags.types';
import { db } from '../firebase';
import { getTimestamp } from '../../utils/Helpers';

const COLL_TAGS = 'tags';

export const addTag = name => dispatch => {
  dispatch({
    type: ADD_TAG.SUCCESS,
    payload: name,
  });
};

export const createTag = async (roomId, tagName) => {
  const tag = {
    dateLastUsed: getTimestamp(),
    name: tagName,
    roomId,
  };
  try {
    const snapshot = await db.collection(COLL_TAGS).add(tag);
    tag.id = snapshot.id;
    return tag;
  } catch (error) {
    console.log('Error Actions, tags, createTag', error);
  }
  return tag;
};

const updateDocTag = async (id, fields) => {
  try {
    const tagRef = db.collection(COLL_TAGS).doc(id);
    await tagRef.update({ ...fields });
  } catch (error) {
    console.log('Error actions.tags, updateDocTag', error);
  }
};

export const updateTagInState = tag => dispatch => {
  dispatch({
    type: UPDATE_TAG.SUCCESS,
    payload: tag,
  });
};

export const updateDateLastUsed = tag => async dispatch => {
  try {
    const dateLastUsed = getTimestamp();
    const tagUpdated = { ...tag, dateLastUsed };
    dispatch(updateTagInState(tagUpdated));
    await updateDocTag(tag.id, { dateLastUsed });
  } catch (error) {
    console.log('Error actions.tags, updateDateLastUsed', error);
  }
};

export const getTagSubscription = roomId => async dispatch => {
  dispatch({
    type: LOAD_TAGS.PENDING,
  });
  let subscription = null;
  try {
    subscription = await db
      .collection(COLL_TAGS)
      .where('roomId', '==', roomId)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const { doc } = change;
            const tag = doc.data();
            const { id } = doc;
            tag.id = id;
            dispatch(addTag(tag));
          }
          if (change.type === 'modified') {
            const { doc } = change;
            const tag = doc.data();
            const { id } = doc;
            tag.id = id;
            dispatch(updateTagInState(tag));
          }
        });
      });
    dispatch({
      type: LOAD_TAGS.SUCCESS,
    });
  } catch (error) {
    console.log('Actions, tags, getTagSubscription', error);
    dispatch({
      type: LOAD_TAGS.ERROR,
    });
  }
  return subscription;
};

export const toggleTag = id => dispatch => {
  dispatch({
    type: TOGGLE_TAG.SUCCESS,
    payload: id,
  });
};
