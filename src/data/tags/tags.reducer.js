import { combineReducers } from 'redux';

import { ADD_TAG, TOGGLE_TAG } from './tags.types';

const initialState = {
  allIds: [],
  byId: {},
};

const reducerTags = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TAG.SUCCESS:
      if (state.byId[action.payload]) return state;
      return {
        ...state,
        allIds: [...state.allIds, action.payload],
        byId: {
          ...state.byId,
          [action.payload]: { id: action.payload, isSelected: false, name: action.payload },
        },
      };
    case TOGGLE_TAG.SUCCESS:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload]: {
            ...state.byId[action.payload],
            isSelected: !state.byId[action.payload].isSelected,
          },
        },
      };
    default:
      return state;
  }
};

export default reducerTags;
