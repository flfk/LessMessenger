import { fetchDocUser } from '../user/user.actions';
import { ADD_MEMBER, LOAD_MEMBERS } from './members.types';

export const addMember = member => dispatch => {
  dispatch({
    type: ADD_MEMBER.SUCCESS,
    payload: member,
  });
};

export const loadMembers = memberUserIDs => async dispatch => {
  dispatch({
    type: LOAD_MEMBERS.PENDING,
  });
  try {
    await Promise.all(
      memberUserIDs.map(async userID => {
        const userDoc = await fetchDocUser(userID);
        dispatch(addMember(userDoc));
      })
    );
    dispatch({
      type: LOAD_MEMBERS.SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: LOAD_MEMBERS.ERROR,
    });
    console.log('members.actions, loadMembers', error);
  }
};
