import moment from 'moment-timezone';
import { auth, db } from '../firebase';
import { updateDocRoom } from '../room/room.actions';
import {
  CREATE_USER,
  GET_LOGGED_IN_USER,
  LOGIN_USER,
  SIGNOUT_USER,
  TOGGLE_TYPING,
} from './user.types';

const COLL_AVATARS = 'avatars';
const COLL_USERS = 'users';

const DEFAULT_AVATAR_ID = 'gVepxC2MyKG1hMZmGXJe';

const getAvatarIds = async () => {
  const avatarIds = [];
  try {
    const avatarsRef = db.collection(COLL_AVATARS);
    const snapshot = await avatarsRef.get();
    snapshot.forEach(snap => avatarIds.push(snap.id));
  } catch (error) {
    console.log('Actions, user, getAvatarIds', error);
  }
  return avatarIds;
};

export const addUserDoc = async (email, name, userId) => {
  try {
    // guess timezone
    const avatarIds = await getAvatarIds();
    const randomAvatarId = avatarIds[Math.floor(Math.random() * avatarIds.length)];
    const timezone = moment.tz.guess();
    await db
      .collection(COLL_USERS)
      .doc(userId)
      .set({ avatarId: randomAvatarId || DEFAULT_AVATAR_ID, email, timezone, name });
  } catch (error) {
    console.log('Actions, user, addUserDoc', error);
  }
};

export const fetchDocUser = async userId => {
  let user = {};
  try {
    const userRef = db.collection(COLL_USERS).doc(userId);
    // mark user status as online
    const snapshot = await userRef.get();

    if (snapshot.size === 0) {
      // TODO show that a member hasn't accepted an invitation yet / no account
    }

    user = snapshot.data();
    user.id = snapshot.id;
  } catch (error) {
    console.error('Error user.actions, fetchDocUser', error);
  }
  return user;
};

export const createUser = (email, name, password) => async dispatch => {
  dispatch({
    type: CREATE_USER.PENDING,
  });
  try {
    const data = await auth.createUserWithEmailAndPassword(email, password);
    const userId = data.user.uid;
    await addUserDoc(email, name, userId);
    dispatch({
      type: CREATE_USER.SUCCESS,
      payload: { email, id: userId, name },
    });
  } catch (error) {
    console.log('Error user.actions, createUser', error);
    dispatch({
      type: CREATE_USER.ERROR,
      payload: error.code,
    });
  }
};

export const getLoggedInUser = () => async dispatch => {
  try {
    const userId = auth.currentUser.uid;
    const userDoc = await fetchDocUser(userId);
    dispatch({
      type: GET_LOGGED_IN_USER.SUCCESS,
      payload: { ...userDoc },
    });
  } catch (error) {
    console.log('Actions, user, getLoggedInUser', error);
    dispatch({
      type: GET_LOGGED_IN_USER.ERROR,
    });
  }
};

// const updateDocUser = async (id, fields) => {
//   try {
//     const userRef = db.collection(COLL_USERS).doc(id);
//     await userRef.update({ ...fields });
//   } catch (error) {
//     console.log('Error user.actions, updateDocUser', error);
//   }
// };

export const toggleIsTyping = (id, isTyping, roomId) => dispatch => {
  dispatch({
    type: TOGGLE_TYPING.SUCCESS,
    payload: isTyping,
  });
  updateDocRoom(roomId, { [`members.${id}.isTyping`]: isTyping });
};

export const logIn = (email, password) => async dispatch => {
  try {
    const data = await auth.signInWithEmailAndPassword(email, password);
    const userId = data.user.uid;
    const userDoc = await fetchDocUser(userId);
    dispatch({
      type: LOGIN_USER.SUCCESS,
      payload: { ...userDoc },
    });
  } catch (error) {
    dispatch({
      type: LOGIN_USER.ERROR,
      payload: error.code,
    });
  }
};

export const signOut = () => async dispatch => {
  dispatch({
    type: SIGNOUT_USER.PENDING,
  });
  try {
    await auth.signOut();
    dispatch({
      type: SIGNOUT_USER.SUCCESS,
      payload: {},
    });
  } catch (error) {
    dispatch({
      type: SIGNOUT_USER.ERROR,
      payload: error.code,
    });
  }
};
