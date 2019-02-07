import _ from 'lodash';

import { SIGNOUT_USER } from '../user/user.types';
import {
  ADD_MESSAGE,
  ALL_MESSAGES_LOADED,
  DELETE_MSG,
  LOADING_MESSAGES,
  SET_LAST_MSG_DOC,
  UPDATE_MESSAGE,
} from './messages.types';

const initialState = {
  allIds: [],
  byId: {},
  isLoading: true,
  hasLoaded: false,
  hasMoreMessages: true,
  lastMsgDoc: null,
};

const reducerMessages = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MESSAGE.SUCCESS:
      if (state.byId && state.byId[action.payload.id]) return state;
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
    case DELETE_MSG.SUCCESS:
      return {
        ...state,
        allIds: state.allIds.filter(id => id !== action.payload.id),
        byId: _.omit(state.byId, [action.payload.id]),
      };
    case LOADING_MESSAGES.PENDING:
      return {
        ...state,
        isLoading: true,
      };
    case LOADING_MESSAGES.SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasLoaded: true,
      };
    case SET_LAST_MSG_DOC.SUCCESS:
      // Need to test that a timestamp exists and it is the last message
      // If no server timestamp on message ignore
      if (!action.payload.data().timestamp) {
        return { ...state };
      }
      // If no last msg doc yet accept last msg doc
      if (!state.lastMsgDoc) {
        return { ...state, lastMsgDoc: action.payload };
        // Only accept a new doc with a timestamp less then current lastMsgDoc
      } else if (
        state.lastMsgDoc.data().timestamp.toMillis() < action.payload.data().timestamp.toMillis()
      ) {
        return { ...state };
      }
      return { ...state, lastMsgDoc: action.payload };
    case SIGNOUT_USER.SUCCESS:
      return {
        ...initialState,
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
