import { createActionSet } from '../../utils/Helpers';

export const CREATE_USER = createActionSet('CREATE_USER');
export const LOGIN_USER = createActionSet('LOGIN_USER');
export const LOGIN_USER_FACEBOOK = createActionSet('LOGIN_USER_FACEBOOK');
export const GET_LOGGED_IN_USER = createActionSet('RETRIEVE_LOGGED_IN_USER');
export const SIGNOUT_USER = createActionSet('SIGNOUT_USER');
export const UPDATE_DISPLAY_NAME = createActionSet('UPDATE_DISPLAY_NAME');
export const UPDATE_EMAIL = createActionSet('UPDATE_EMAIL');
export const UPDATE_USER = createActionSet('UPDATE_USER');
