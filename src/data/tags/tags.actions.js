import { ADD_TAG, TOGGLE_TAG } from './tags.types';

export const addTag = tagName => dispatch => {
  dispatch({
    type: ADD_TAG.SUCCESS,
    payload: tagName,
  });
};

export const toggleTag = tagName => dispatch => {
  dispatch({
    type: TOGGLE_TAG.SUCCESS,
    payload: tagName,
  });
};
