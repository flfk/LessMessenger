import { createActionSet } from '../../utils/Helpers';

export const ADD_MESSAGE = createActionSet('ADD_MESSAGE');
export const ALL_MESSAGES_LOADED = createActionSet('ALL_MESSAGES_LOADED');
export const CANCEL_REPLY = createActionSet('CANCEL_REPLY');
export const DELETE_MSG = createActionSet('DELETE_MSG');
export const LOADING_MESSAGES = createActionSet('LOADING_MESSAGES');
export const SEND_MESSAGE = createActionSet('SEND_MESSAGE');
export const SET_LAST_MSG_DOC = createActionSet('SET_LAST_MSG_DOC');
export const REPLY_TO_MESSAGE = createActionSet('REPLY_TO_MESSAGE');
export const UPDATE_MESSAGE = createActionSet('UPDATE_MESSAGE');
