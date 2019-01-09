import { db } from '../firebase';
import { LOAD_ROOM } from './room.types';

const COLL_ROOMS = 'rooms';

export const loadRoom = pathname => async dispatch => {
  dispatch({
    type: LOAD_ROOM.PENDING,
  });
  try {
    const roomRef = db.collection(COLL_ROOMS).where('pathname', '==', pathname);
    const snapshot = await roomRef.limit(1).get();

    if (snapshot.size === 0) {
      dispatch({
        type: LOAD_ROOM.ERROR,
      });
    }

    snapshot.forEach(doc => {
      const room = doc.data();
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
};
