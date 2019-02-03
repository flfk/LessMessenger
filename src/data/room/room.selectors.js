import { createSelector } from 'reselect';

// selector
export const getRoom = state => state.room;

// reselect function
export const getRoomState = createSelector(
  [getRoom],
  room => room
);

export const getMemberIds = createSelector(
  [getRoom],
  room => {
    // if available get keys from member objects
    if (room.members) return Object.keys(room.members);
    // if not yet loaded return empty
    return [];
  }
);
