import { createSelector } from 'reselect';

// selector
export const getRoom = state => state.room;

// reselect function
export const getRoomState = createSelector(
  [getRoom],
  room => room
);
