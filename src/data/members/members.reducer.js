import { ADD_MEMBER } from './members.types';

const initialState = [];

const reducerMembers = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MEMBER.SUCCESS:
      return [...state, action.payload];
    default:
      return state;
  }
};

export default reducerMembers;
