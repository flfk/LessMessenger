import { createSelector } from 'reselect';

import { denormalize } from '../../utils/Helpers';
import { getTags } from '../tags/tags.selectors';

// selector
const getMessages = state => state.messages;

// reselect function
export const getMessagesState = createSelector(
  [getMessages],
  messages => denormalize(messages)
);

export const getFilteredMessages = createSelector(
  [getMessages, getTags],
  (messages, tags) => {
    const tagsSelected = denormalize(tags).filter(tag => tag.isSelected);
    if (tagsSelected.length === 0) return denormalize(messages);

    const messagesFiltered = denormalize(messages).filter(msg => {
      if (msg.tagIds) {
        let areMsgTagsSelected = true;
        tagsSelected.forEach(tag => {
          areMsgTagsSelected = areMsgTagsSelected && msg.tagIds.indexOf(tag.id) > -1;
        });
        if (areMsgTagsSelected) return true;
      }
      return false;
    });
    return messagesFiltered;
  }
);
