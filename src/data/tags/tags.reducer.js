import { ADD_TAG, TOGGLE_TAG, UPDATE_TAG } from './tags.types';

const initialState = {
  allIds: [],
  byId: {},
  isLoading: true,
};

const reducerTags = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TAG.SUCCESS:
      if (state.byId[action.payload.id]) return state;
      return {
        ...state,
        allIds: [...state.allIds, action.payload.id],
        byId: { ...state.byId, [action.payload.id]: { ...action.payload, isSelected: false } },
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
    case UPDATE_TAG.SUCCESS:
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

export default reducerTags;
