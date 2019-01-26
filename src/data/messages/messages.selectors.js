import { createSelector } from 'reselect';

import { denormalize } from '../../utils/Helpers';

// selector
const getMessages = state => state.messages;

// reselect function
export const getMessagesState = createSelector(
  [getMessages],
  messages => denormalize(messages)
);
