import _ from 'lodash';
import { createSelector } from 'reselect';

import { denormalize } from '../../utils/Helpers';

import { getMembers } from '../members/members.selectors';

const getMessages = state => state.messages;

export const getMessagesState = createSelector(
  [getMessages],
  messages => denormalize(messages)
);

const filterNotSeenByAllOrSaved = memberIds => msg => {
  if (msg.savesByUserId && msg.savesByUserId.length > 0) return true;
  if (!msg.seenByUserId || msg.seenByUserId.length !== memberIds.length) return true;
  if (_.isEqual(_.sortBy(msg.seenByUserId), _.sortBy(memberIds))) return false;
  return true;
};

export const getFilteredMessages = createSelector(
  [getMessages, getMembers],
  (messages, members) => {
    const memberIds = denormalize(members).map(member => member.id);
    const messagesFiltered = denormalize(messages).filter(filterNotSeenByAllOrSaved(memberIds));
    return messagesFiltered;
  }
);
