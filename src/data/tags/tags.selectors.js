import { createSelector } from 'reselect';

import { denormalize } from '../../utils/Helpers';

// selector
export const getTags = state => state.tags;

// reselect function
export const getTagsState = createSelector(
  [getTags],
  tags => denormalize(tags)
);

export const getTagsSelectedState = createSelector(
  [getTags],
  tags => denormalize(tags).filter(tag => tag.isSelected)
);
