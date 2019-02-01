import shortid from 'shortid';

import { db, firebase } from '../firebase';
import { getTimestamp } from '../../utils/Helpers';
import { CREATE_ROOM, TOGGLE_INVITE_MEMBER, LOAD_ROOM } from './room.types';

const COLL_ROOMS = 'rooms';
const KEY_MOST_RECENT_SIGN_IN = 'mostRecentSignInById';

export const addUserIdToMembers = (roomId, userId) => async dispatch => {
  try {
    const roomRef = db.collection(COLL_ROOMS).doc(roomId);
    roomRef.update({ memberUserIds: firebase.firestore.FieldValue.arrayUnion(userId) });
  } catch (error) {
    console.error('Error room.actions, addUserIdToMembers', error);
  }
};

export const toggleInviteMember = () => dispatch => {
  dispatch({
    type: TOGGLE_INVITE_MEMBER.SUCCESS,
  });
};

const isPathnameTaken = async pathname => {
  try {
    const roomRef = await db.collection(COLL_ROOMS).where('pathname', '==', pathname);
    const snapshot = roomRef.get();
    if (snapshot.empty) {
      return false;
    }
  } catch (error) {
    console.error('Error room.actions, isPathnameTaken', error);
  }
  return true;
};

export const createRoom = room => async dispatch => {
  dispatch({
    type: CREATE_ROOM.PENDING,
  });
  try {
    // test if pathname is taken if not try random id
    const { pathname } = room;
    const pathnameIsTaken = await isPathnameTaken(pathname);
    const pathnameUpdated = pathnameIsTaken ? `${pathname}-${shortid.generate()}` : pathname;
    const roomUpdated = { ...room, pathname: pathnameUpdated };
    const roomRef = await db.collection(COLL_ROOMS).add(roomUpdated);
    dispatch({
      type: CREATE_ROOM.SUCCESS,
      payload: { ...roomUpdated, id: roomRef.id },
    });
  } catch (error) {
    dispatch({
      type: CREATE_ROOM.ERROR,
      payload: error.code,
    });
  }
};

export const inviteMember = (email, roomId) => async dispatch => {
  try {
    const roomRef = db.collection(COLL_ROOMS).doc(roomId);
    roomRef.update({ emailsInvited: firebase.firestore.FieldValue.arrayUnion(email) });
  } catch (error) {
    console.error('Error room.actions, inviteMember', error);
  }
};

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
    console.error('Error room.actions, loadRoom', error);
    dispatch({
      type: LOAD_ROOM.ERROR,
    });
  }
  return room;
};

export const updateMostRecentSignIn = async (roomId, userId) => {
  try {
    if (roomId) {
      const timestamp = getTimestamp();
      // db.collection(COLL_ROOMS).doc(roomId).update({ `${KEY_MOST_RECENT_SIGN_IN}.${userId}` : timestamp});
      db.collection(COLL_ROOMS)
        .doc(roomId)
        .update({ [`${KEY_MOST_RECENT_SIGN_IN}.${userId}`]: timestamp });
    }
  } catch (error) {
    console.log('Error, room.actions, updateMostRecentSignIn', error);
  }
};
