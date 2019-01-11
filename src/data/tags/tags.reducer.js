import _ from 'lodash';

import { ADD_TAG, TOGGLE_TAG } from './tags.types';

const initialState = [];

const reducerTags = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TAG.SUCCESS:
      // If already included don't add again
      if (_.findIndex(state, { name: action.payload }) > 0) {
        return state;
      }
      return [...state, { name: action.payload, isSelected: false }];
    case TOGGLE_TAG.SUCCESS:
      return state.map(tag => {
        if (tag.name === action.payload) {
          return { name: tag.name, isSelected: !tag.isSelected };
        }
        return tag;
      });
    default:
      return state;
  }
};

export default reducerTags;
