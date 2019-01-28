import { createSelector } from 'reselect';

import { denormalize } from '../../utils/Helpers';

// selector
export const getMembers = state => state.members;

// reselect function
export const getMembersState = createSelector(
  [getMembers],
  members => denormalize(members)
);
