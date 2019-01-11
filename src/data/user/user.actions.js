import { auth, db } from '../firebase';
import {
  CREATE_USER,
  GET_LOGGED_IN_USER,
  LOGIN_USER,
  LOGIN_USER_FACEBOOK,
  SIGNOUT_USER,
  UPDATE_USER,
} from './user.types';

const COLL_USERS = 'users';

export const addUserDoc = async (email, name, userID) => {
  try {
    await db
      .collection(COLL_USERS)
      .doc(userID)
      .set({ email, name });
  } catch (error) {
    console.log('Actions, user, addUserDoc', error);
  }
};

export const fetchDocUser = async userID => {
  let user = {};
  try {
    const userRef = db.collection(COLL_USERS).doc(userID);
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
    const userID = data.user.uid;
    await addUserDoc(email, name, userID);
    dispatch({
      type: CREATE_USER.SUCCESS,
      payload: { email, id: userID, name },
    });
  } catch (error) {
    dispatch({
      type: CREATE_USER.ERROR,
      payload: error.code,
    });
  }
};

export const getLoggedInUser = () => async dispatch => {
  try {
    const userID = auth.currentUser.uid;
    const userDoc = await fetchDocUser(userID);
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

export const logIn = (email, password) => async dispatch => {
  try {
    const data = await auth.signInWithEmailAndPassword(email, password);
    const userID = data.user.uid;
    const userDoc = await fetchDocUser(userID);
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

export const logInWithFacebook = () => async dispatch => {
  dispatch({
    type: LOGIN_USER_FACEBOOK.PENDING,
  });
  const provider = new auth.FacebookAuthProvider();
  await auth().signInWithPopup(provider);

  // fetchUserFacebook().then(response => {
  //   const { token, name } = response;
  //   signInWithCredential(token)
  //     .then(user => {
  //       dispatch({
  //         type: LOGIN_USER_FACEBOOK.SUCCESS,
  //         payload: user,
  //       });
  //     })
  //     .catch(error => {
  //       dispatch({
  //         type: LOGIN_USER_FACEBOOK.ERROR,
  //         payload: error.message,
  //       });
  //       console.log('Error actions user login with facebook, ', error);
  //     });
  // });
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
