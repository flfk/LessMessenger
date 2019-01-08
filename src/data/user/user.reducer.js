import {} from './user.types';

const initialState = {
  id: 'abc',
  displayName: 'Sammy',
};

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
