import shortid from 'shortid';

import { db, firebase, oldRealTimeDb } from '../firebase';
import { getTimestamp } from '../../utils/Helpers';
import { CREATE_ROOM, TOGGLE_INVITE_MEMBER, LOAD_ROOM, UPDATE_ROOM } from './room.types';

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
    roomRef.update({
      [`members.${userId}.isOnline`]: true,
      [`members.${userId}.isTyping`]: false,
      [`members.${userId}.mostRecentSignOut`]: 0,
    });
  } catch (error) {
    console.error('Error room.actions, addUserIdToMembers', error);
  }
};

export const changeUserStatusToOnline = (roomId, userId) => async dispatch => {
  // connect to old Realtime DB and the list of connections
  const onlineRef = oldRealTimeDb.ref('.info/connected');
  const oldRealTimeDbRef = `/status/${roomId}/${userId}`;
  onlineRef.on('value', snapshot => {
    oldRealTimeDb
      .ref(oldRealTimeDbRef)
      .onDisconnect()
      .set('offline')
      .then(() => {
        // set online status in firestore
        const roomRef = db.collection(COLL_ROOMS).doc(roomId);
        roomRef.update({ [`members.${userId}.isOnline`]: true });
        // set online status in real time database
        oldRealTimeDb.ref(oldRealTimeDbRef).set('online');
      });
  });
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
    const emailReq = {
      email,
      roomName: room.name,
      roomURL: `${BASE_URL}${pathnameUpdated}`,
      type: 'signUp',
    };
    await addDocEmailRequest(emailReq);
    dispatch({
      type: CREATE_ROOM.SUCCESS,
      payload: { pathname: pathnameUpdated, id: roomAdded.id },
    });
  } catch (error) {
    dispatch({
      type: CREATE_ROOM.ERROR,
      payload: error.code,
    });
  }
  return { ...roomUpdated, id: roomAdded.id };
};

const isPathnameTaken = async pathname => {
  try {
    const roomRef = db.collection(COLL_ROOMS).where('pathname', '==', pathname);
    const snapshot = await roomRef.get();
    if (snapshot.empty) {
      return false;
    }
  } catch (error) {
    console.error('Error room.actions, isPathnameTaken', error);
  }
  return true;
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
    addDocEmailRequest(emailReq);
  } catch (error) {
    console.error('Error room.actions, inviteMember', error);
  }
};

// export const loadRoom = pathname => async dispatch => {
//   dispatch({
//     type: LOAD_ROOM.PENDING,
//   });
//   let room = null;
//   try {
//     const roomRef = db.collection(COLL_ROOMS).where('pathname', '==', pathname);
//     const snapshot = await roomRef.limit(1).get();

//     if (snapshot.size === 0) {
//       dispatch({
//         type: LOAD_ROOM.ERROR,
//       });
//     }

//     snapshot.forEach(doc => {
//       room = doc.data();
//       const { id } = doc;
//       room.id = id;
//       dispatch({
//         type: LOAD_ROOM.SUCCESS,
//         payload: room,
//       });
//     });
//   } catch (error) {
//     console.error('Error room.actions, loadRoom', error);
//     dispatch({
//       type: LOAD_ROOM.ERROR,
//     });
//   }
//   return room;
// };

export const toggleInviteMember = () => dispatch => {
  dispatch({
    type: TOGGLE_INVITE_MEMBER.SUCCESS,
  });
};

export const updateDocRoom = async (id, fields) => {
  try {
    const roomRef = db.collection(COLL_ROOMS).doc(id);
    await roomRef.update({ ...fields });
  } catch (error) {
    console.log('Error room.actions, updateDocRoom', error);
  }
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

export const updateLastActive = async (roomId, userId) => {
  try {
    if (roomId) {
      const timestamp = getTimestamp();
      // db.collection(COLL_ROOMS).doc(roomId).update({ `${KEY_MOST_RECENT_SIGN_IN}.${userId}` : timestamp});
      db.collection(COLL_ROOMS)
        .doc(roomId)
        .update({ [`lastActiveByUserId.${userId}`]: timestamp });
    }
  } catch (error) {
    console.log('Error, room.actions, updateMostRecentSignIn', error);
  }
};

// SUBSCRIPTIONS
const handleRoomSnapshot = dispatch => async snapshot => {
  if (snapshot.empty) {
    dispatch({
      type: LOAD_ROOM.ERROR,
    });
  }
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      const { doc } = change;
      const room = doc.data();
      const { id } = doc;
      room.id = id;
      dispatch({
        type: LOAD_ROOM.SUCCESS,
        payload: room,
      });
    }
    if (change.type === 'modified') {
      // will be modified when the timestamp updates

      const { doc } = change;
      const room = doc.data();
      const { id } = doc;
      room.id = id;
      dispatch({
        type: UPDATE_ROOM.SUCCESS,
        payload: room,
      });
    }
  });
};

export const getRoomSubscription = pathname => async dispatch => {
  dispatch({
    type: LOAD_ROOM.PENDING,
  });
  let subscription = null;
  try {
    // const roomRef = db.collection(COLL_ROOMS).doc(roomId);
    const roomRef = db
      .collection(COLL_ROOMS)
      .where('pathname', '==', pathname)
      .limit(1);
    subscription = roomRef.onSnapshot(handleRoomSnapshot(dispatch));
  } catch (error) {
    console.log('room.actions, getRoomSubscription', error);
  }
  return subscription;
};
