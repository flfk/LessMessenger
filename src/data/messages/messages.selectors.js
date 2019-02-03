import _ from 'lodash';
import { createSelector } from 'reselect';

import { denormalize } from '../../utils/Helpers';

import { getMembers } from '../members/members.selectors';
import { getRoom } from '../room/room.selectors';
// import { getTags } from '../tags/tags.selectors';

// selector
const getMessages = state => state.messages;

// reselect function
export const getMessagesState = createSelector(
  [getMessages],
  messages => denormalize(messages)
);

const filterNotSeenByAllOrSaved = memberIds => msg => {
  if (msg.savesByUserId && msg.savesByUserId.length > 0) {
    // console.log('saved by a user', msg.savesByUserId);
    return true;
  }
  if (!msg.seenByUserId || msg.seenByUserId.length !== memberIds.length) {
    // console.log('not seen by UserId or not by as many users', msg.seenByUserId, memberIds.length);
    return true;
  }
  if (_.isEqual(_.sortBy(msg.seenByUserId), _.sortBy(memberIds))) {
    // console.log('seen by all users');
    return false;
  }
  // console.log('No cases matched, return true');
  return true;
};

export const getFilteredMessages = createSelector(
  [getMessages, getMembers],
  (messages, members) => {
    // const leastRecentSignInDate = Object.values(room.mostRecentSignInById).sort()[0];
    const memberIds = denormalize(members).map(member => member.id);
    const messagesFiltered = denormalize(messages).filter(filterNotSeenByAllOrSaved(memberIds));

    // console.log('messages.selectors messagesFiltered', messagesFiltered);
    return messagesFiltered;
  }
);
