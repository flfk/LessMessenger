import { LOAD_ROOM } from './room.types';
import { LOAD_MESSAGES } from '../messages/messages.types';

const initialState = {
  error: false,
  id: '',
  isLoading: true,
  isLoadingMessages: false,
  memberUserIDs: [],
  name: '',
  pathname: '',
};

const reducerRoom = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_MESSAGES.PENDING:
      return { ...state, isLoadingMessages: true };
    case LOAD_MESSAGES.SUCCESS:
      return { ...state, isLoadingMessages: false };
    case LOAD_ROOM.PENDING:
      return { ...state, isLoading: true };
    case LOAD_ROOM.SUCCESS:
      return { ...state, ...action.payload, isLoading: false };
    case LOAD_ROOM.ERROR:
      return { ...state, error: true, isLoading: false };
    default:
      return state;
  }
};

export default reducerRoom;
