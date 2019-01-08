import {} from './messages.types';

const initialState = {};

const reducerMessages = (state = initialState, action) => {
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

export default reducerMessages;
