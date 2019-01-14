import { LOAD_ROOM } from './room.types';
import { CANCEL_REPLY, LOAD_MESSAGES, REPLY_TO_MESSAGE } from '../messages/messages.types';
import { LOAD_MEMBERS } from '../members/members.types';

const initialState = {
  error: false,
  id: '',
  isLoading: true,
  isLoadingMessages: false,
  isLoadingMembers: true,
  memberUserIDs: [],
  name: '',
  pathname: '',
  msgIDBeingRepliedTo: '',
};

const reducerRoom = (state = initialState, action) => {
  switch (action.type) {
    case CANCEL_REPLY.SUCCESS:
      return { ...state, msgIDBeingRepliedTo: '' };
    case LOAD_MESSAGES.PENDING:
      return { ...state, isLoadingMessages: true };
    case LOAD_MESSAGES.SUCCESS:
      return { ...state, isLoadingMessages: false };
    case LOAD_MEMBERS.SUCCESS:
      return { ...state, isLoadingMembers: false };
    case LOAD_ROOM.PENDING:
      return { ...state, isLoading: true };
    case LOAD_ROOM.SUCCESS:
      return { ...state, ...action.payload, isLoading: false };
    case LOAD_ROOM.ERROR:
      return { ...state, error: true, isLoading: false };
    case REPLY_TO_MESSAGE.SUCCESS:
      return { ...state, msgIDBeingRepliedTo: action.payload };
    default:
      return state;
  }
};

export default reducerRoom;
