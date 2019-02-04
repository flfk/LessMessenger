import { db } from '../firebase';
import { ADD_MEMBER, LOAD_MEMBERS } from './members.types';

const COLL_AVATARS = 'avatars';
const COLL_USERS = 'users';

export const addMember = member => dispatch => {
  dispatch({
    type: ADD_MEMBER.SUCCESS,
    payload: member,
  });
};

const getAvatar = async avatarId => {
  let avatar = null;
  try {
    const avatarRef = db.collection(COLL_AVATARS).doc(avatarId);
    const snapshot = await avatarRef.get();
    avatar = snapshot.data();
    avatar.id = snapshot.id;
  } catch (error) {
    console.log('members.actions, getAvatar', error);
  }
  return avatar;
};

// SUBSCRIPTIONS
const handleMemberSnapshot = dispatch => async doc => {
  const member = doc.data();
  const { id } = doc;
  member.id = id;
  const avatar = await getAvatar(member.avatarId);
  member.avatar = avatar;
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
