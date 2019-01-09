import { LOAD_MESSAGES } from '../messages/messages.types';

const initialState = {
  isLoading: false,
  messages: [],
};

const reducerRoom = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_MESSAGES.PENDING:
      return { ...state, isLoading: true };
    case LOAD_MESSAGES.SUCCESS:
      return { ...state, isLoading: false };
    default:
      return state;
  }
};

export default reducerRoom;
