import _ from 'lodash';

import { ADD_MEMBER, DELETE_MEMBER } from './members.types';

const initialState = {
  allIds: [],
  byId: {},
  isLoading: true,
};

const reducerMembers = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MEMBER.SUCCESS:
      // snapshots on individual documents, hence all changes result in new document added
      if (state.byId[action.payload.id])
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.payload.id]: { ...state.byId[action.payload.id], ...action.payload },
          },
        };
      return {
        ...state,
        allIds: [...state.allIds, action.payload.id],
        byId: { ...state.byId, [action.payload.id]: action.payload },
      };
    case DELETE_MEMBER.SUCCESS:
      return {
        ...state,
        allIds: state.allIds.filter(id => id !== action.payload.id),
        byId: _.omit(state.byId, [action.payload.id]),
      };
    default:
      return state;
  }
};

export default reducerMembers;
