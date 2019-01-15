import { ADD_TAG, TOGGLE_TAG } from './tags.types';

export const addTag = name => dispatch => {
  dispatch({
    type: ADD_TAG.SUCCESS,
    payload: name,
  });
};

export const toggleTag = name => dispatch => {
  dispatch({
    type: TOGGLE_TAG.SUCCESS,
    payload: name,
  });
};
