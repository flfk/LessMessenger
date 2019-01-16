import { SIGNOUT_USER } from '../user/user.types';
import {
  ADD_MESSAGE,
  ALL_MESSAGES_LOADED,
  UPDATE_MESSAGE,
  SET_LAST_MSG_DOC,
} from './messages.types';

const initialState = {
  allIds: [],
  byId: {},
  lastMsgDoc: {},
  hasMoreMessages: true,
};

const reducerMessages = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSAGE.SUCCESS:
      return {
        ...state,
        allIds: [...state.allIds, action.payload.id],
        byId: { ...state.byId, [action.payload.id]: action.payload },
      };
    case ALL_MESSAGES_LOADED.SUCCESS:
      return {
        ...state,
        hasMoreMessages: false,
      };
    case SET_LAST_MSG_DOC.SUCCESS:
      return { ...state, lastMsgDoc: action.payload };
    case SIGNOUT_USER.SUCCESS:
      return {
        initialState,
      };
    case UPDATE_MESSAGE.SUCCESS:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: { ...state.byId[action.payload.id], ...action.payload },
        },
      };
    default:
      return state;
  }
};

export default reducerMessages;
