import { db } from '../firebase';
import { getTimestamp } from '../../utils/Helpers';
import { LOAD_ROOM } from './room.types';

const COLL_ROOMS = 'rooms';
const KEY_MOST_RECENT_SIGN_IN = 'mostRecentSignInById';

export const loadRoom = pathname => async dispatch => {
  dispatch({
    type: LOAD_ROOM.PENDING,
  });
  let room = null;
  try {
    const roomRef = db.collection(COLL_ROOMS).where('pathname', '==', pathname);
    const snapshot = await roomRef.limit(1).get();

    if (snapshot.size === 0) {
      dispatch({
        type: LOAD_ROOM.ERROR,
      });
    }

    snapshot.forEach(doc => {
      room = doc.data();
      const { id } = doc;
      room.id = id;
      dispatch({
        type: LOAD_ROOM.SUCCESS,
        payload: room,
      });
    });
  } catch (error) {
    console.error('Error actions, loadRoom', error);
    dispatch({
      type: LOAD_ROOM.ERROR,
    });
  }
  return room;
};

export const updateMostRecentSignIn = async (roomId, userId) => {
  try {
    const timestamp = getTimestamp();
    // db.collection(COLL_ROOMS).doc(roomId).update({ `${KEY_MOST_RECENT_SIGN_IN}.${userId}` : timestamp});
    db.collection(COLL_ROOMS)
      .doc(roomId)
      .update({ [`${KEY_MOST_RECENT_SIGN_IN}.${userId}`]: timestamp });
  } catch (error) {
    console.log('Error, room.actions, updateMostRecentSignIn', error);
  }
};
