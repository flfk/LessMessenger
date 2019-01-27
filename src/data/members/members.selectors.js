import { createSelector } from 'reselect';

import { denormalize } from '../../utils/Helpers';

// selector
const getMembers = state => state.members;

// reselect function
export const getMembersState = createSelector(
  [getMembers],
  members => denormalize(members)
);
