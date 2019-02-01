import shortid from 'shortid';

import { db, firebase } from '../firebase';
import { getTimestamp } from '../../utils/Helpers';
import { CREATE_ROOM, TOGGLE_INVITE_MEMBER, LOAD_ROOM } from './room.types';

const COLL_EMAILS = 'emailRequests';
const COLL_ROOMS = 'rooms';
const KEY_MOST_RECENT_SIGN_IN = 'mostRecentSignInById';

const BASE_URL = 'https://lessmessenger.com/';

export const addDocEmailRequest = async emailReq => {
  try {
    db.collection(COLL_EMAILS).add(emailReq);
  } catch (error) {
    console.error('Error room.actions, addDocEmailRequest', error);
  }
};

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
    console.log('isPathnameTaken snapshot', snapshot);
    if (snapshot.empty) {
      console.log('roompathname is not taken');
      return false;
    }
  } catch (error) {
    console.error('Error room.actions, isPathnameTaken', error);
  }
  return true;
};

export const createRoom = (email, room) => async dispatch => {
  let roomUpdated = {};
  let roomAdded = {};
  dispatch({
    type: CREATE_ROOM.PENDING,
  });
  try {
    // test if pathname is taken if not try random id
    const { pathname } = room;
    const pathnameIsTaken = await isPathnameTaken(pathname);
    const pathnameUpdated = pathnameIsTaken ? `${pathname}-${shortid.generate()}` : pathname;
    roomUpdated = { ...room, pathname: pathnameUpdated };
    roomAdded = await db.collection(COLL_ROOMS).add(roomUpdated);
    dispatch({
      type: CREATE_ROOM.SUCCESS,
      payload: { ...roomUpdated, id: roomAdded.id },
    });
    const emailReq = {
      email,
      roomName: room.name,
      roomURL: `${BASE_URL}${pathnameUpdated}`,
      type: 'signUp',
    };
    console.log('room.actions, emailReq', emailReq);
    addDocEmailRequest(emailReq);
  } catch (error) {
    dispatch({
      type: CREATE_ROOM.ERROR,
      payload: error.code,
    });
  }
  return { ...roomUpdated, id: roomAdded.id };
};

export const inviteMember = (
  email,
  inviterName,
  roomId,
  roomName,
  roomPathname
) => async dispatch => {
  try {
    const roomRef = db.collection(COLL_ROOMS).doc(roomId);
    roomRef.update({ emailsInvited: firebase.firestore.FieldValue.arrayUnion(email) });
    const emailReq = {
      email,
      inviterName,
      roomName,
      roomURL: `${BASE_URL}${roomPathname}`,
      type: 'invite',
    };
    console.log('room.actions, emailReq', emailReq);
    addDocEmailRequest(emailReq);
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
