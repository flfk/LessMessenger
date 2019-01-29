import { db } from '../firebase';
import { fetchDocUser } from '../user/user.actions';
import { ADD_MEMBER, DELETE_MEMBER, LOAD_MEMBERS } from './members.types';

const COLL_USERS = 'users';

export const addMember = member => dispatch => {
  dispatch({
    type: ADD_MEMBER.SUCCESS,
    payload: member,
  });
};

// SUBSCRIPTIONS
const handleMemberSnapshot = dispatch => doc => {
  const member = doc.data();
  const { id } = doc;
  member.id = id;
  dispatch(addMember(member));
};

export const getMemberSubscription = userId => async dispatch => {
  dispatch({
    type: LOAD_MEMBERS.PENDING,
  });
  let subscription = null;
  try {
    const memberRef = db.collection(COLL_USERS).doc(userId);
    subscription = memberRef.onSnapshot(handleMemberSnapshot(dispatch));
    dispatch({
      type: LOAD_MEMBERS.SUCCESS,
    });
  } catch (error) {
    console.log('members.actions, getMemberSubscription', error);
  }
  return subscription;
};
