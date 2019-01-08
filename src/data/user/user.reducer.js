import {} from './user.types';

const initialState = {};

const reducerUser = (state = initialState, action) => {
  switch (action.type) {
    // case CREATE_USER.PENDING:
    //   return {
    //     ...state,
    //     isPending: true,
    //   };
    default:
      return state;
  }
};

export default reducerUser;
