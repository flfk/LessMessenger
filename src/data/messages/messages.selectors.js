import { createSelector } from 'reselect';

import { denormalize } from '../../utils/Helpers';
// import { getTags } from '../tags/tags.selectors';
import { getMembers } from '../members/members.selectors';

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

const filterForNew = earliestDateLastActive => msg => {
  return true;
  if (msg.tagIds && msg.tagIds.length > 0) return true;
  if (msg.timestamp > earliestDateLastActive) return true;
  return false;
};

export const getFilteredMessages = createSelector(
  // [getMessages, getMembers, getTags],
  [getMessages, getMembers],
  // (messages, members, tags) => {
  (messages, members) => {
    // const tagsSelected = denormalize(tags).filter(tag => tag.isSelected);

    const membersDenormalized = denormalize(members);
    const earliestMemberInactive = membersDenormalized.sort(
      (a, b) => a.dateLastActive - b.dateLastActive
    )[0];

    const earliestDateLastActive = earliestMemberInactive
      ? earliestMemberInactive.dateLastActive
      : 0;

    const messagesFiltered = denormalize(messages)
      // .filter(filterForSelectedTags(tagsSelected))
      .filter(filterForNew(earliestDateLastActive));
    return messagesFiltered;
  }
);
