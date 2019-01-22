import { ADD_TAG, CREATE_TAG, LOAD_TAGS, TOGGLE_TAG, UPDATE_TAG } from './tags.types';
import { db } from '../firebase';

const COLL_TAGS = 'tags';

export const addTag = name => dispatch => {
  dispatch({
    type: ADD_TAG.SUCCESS,
    payload: name,
  });
};

export const createTag = tag => async dispatch => {
  try {
    await db.collection(COLL_TAGS).add({ tag });
    dispatch({
      type: CREATE_TAG.SUCCESS,
    });
  } catch (error) {
    console.log('Error Actions, tags, createTag', error);
    dispatch({
      type: CREATE_TAG.ERROR,
    });
  }
};

export const updateTagInState = tag => dispatch => {
  dispatch({
    type: UPDATE_TAG.SUCCESS,
    payload: tag,
  });
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
        // If snapshot for changes required need to add new change type
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const { doc } = change;
            const tag = doc.data();
            const { id } = doc;
            tag.id = id;
            console.log('added tag', tag);
            dispatch(addTag(tag));
          }
          if (change.type === 'modified') {
            const { doc } = change;
            const tag = doc.data();
            const { id } = doc;
            tag.id = id;
            console.log('modified', tag);
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

export const toggleTag = name => dispatch => {
  dispatch({
    type: TOGGLE_TAG.SUCCESS,
    payload: name,
  });
};
