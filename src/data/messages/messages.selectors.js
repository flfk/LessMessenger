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

// const filterForSelectedTags = tagsSelected => msg => {
//   if (tagsSelected.length === 0) return true;
//   if (msg.tagIds) {
//     let areMsgTagsSelected = true;
//     tagsSelected.forEach(tag => {
//       areMsgTagsSelected = areMsgTagsSelected && msg.tagIds.indexOf(tag.id) > -1;
//     });
//     if (areMsgTagsSelected) return true;
//   }
//   return false;
// };

export const getFilteredMessages = createSelector(
  // [getMessages, getMembers, getTags],
  [getMessages, getRoom],
  // (messages, members, tags) => {
  (messages, room) => {
    // const tagsSelected = denormalize(tags).filter(tag => tag.isSelected);

    const leastRecentSignInDate = Object.values(room.mostRecentSignInById).sort()[0];
    const messagesFiltered = denormalize(messages)
      // .filter(filterForSelectedTags(tagsSelected))
      .filter(
        msg =>
          msg.timestamp > leastRecentSignInDate ||
          (msg.savesByUserId && msg.savesByUserId.length > 0)
      );

    // console.log('messages.selectors messagesFiltered', messagesFiltered);
    return messagesFiltered;
  }
);
