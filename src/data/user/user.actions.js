import { auth } from '../firebase';
import {
  CREATE_USER,
  GET_LOGGED_IN_USER,
  LOGIN_USER,
  LOGIN_USER_FACEBOOK,
  SIGNOUT_USER,
  UPDATE_USER,
} from './user.types';

export const createUser = (email, password) => async dispatch => {
  dispatch({
    type: CREATE_USER.PENDING,
  });
  try {
    const data = await auth.createUserWithEmailAndPassword(email, password);
    dispatch({
      type: CREATE_USER.SUCCESS,
      payload: { id: data.user.uid },
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
    dispatch({
      type: GET_LOGGED_IN_USER.SUCCESS,
      payload: { id: userID },
    });
  } catch (error) {
    console.log('Actions, user, getLoggedInUser');
    dispatch({
      type: GET_LOGGED_IN_USER.ERROR,
    });
  }
};

export const logIn = (email, password) => async dispatch => {
  try {
    const data = await auth.signInWithEmailAndPassword(email, password);
    dispatch({
      type: LOGIN_USER.SUCCESS,
      payload: { id: data.user.uid },
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
