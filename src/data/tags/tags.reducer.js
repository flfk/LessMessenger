import { combineReducers } from 'redux';

import { ADD_TAG, TOGGLE_TAG } from './tags.types';

const initialState = {
  allIds: [],
  byId: {},
};

const reducerTags = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TAG.SUCCESS:
      console.log('adding tag reducer');
      if (state.byId[action.payload]) return state;
      console.log('adding new tag tag reducer');
      return {
        ...state,
        allIds: [...state.allIds, action.payload],
        byId: {
          ...state.byId,
          [action.payload]: { id: action.payload, isSelected: false, name: action.payload },
        },
      };
    case TOGGLE_TAG.SUCCESS:
      console.log('reducer toggle', action.payload);
      console.log('state is currently', state.byId[action.payload]);
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

const allIds = (state = [], action) => {
  switch (action.type) {
    case ADD_TAG.SUCCESS:
      if (state[action.payload]) return state;
      return [...state, action.payload.id];
    default:
      return state;
  }
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case ADD_TAG.SUCCESS:
      if (state[action.payload]) return state;
      return { ...state, [action.payload.id]: action.payload };
    case TOGGLE_TAG.SUCCESS:
      return {};
    default:
      return state;
  }
};

// const reducerTags = combineReducers({
//   allIds,
//   byId,
// });

export default reducerTags;
