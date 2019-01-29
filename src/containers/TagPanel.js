// import mixpanel from 'mixpanel-browser';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { getFilteredMessages } from '../data/messages/messages.selectors';
import Scrollable from '../components/Scrollable';
import { TagHeader, TagItem, Wrapper } from '../components/tagPanel';
// import { getTagSubscription, toggleTag } from '../data/tags/tags.actions';
// import { getTagsState, getTagsSelectedState } from '../data/tags/tags.selectors';

const propTypes = {
  actionGetTagSubscription: PropTypes.func.isRequired,
  actionToggleTag: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      isSelected: PropTypes.bool.isRequired,
    })
  ).isRequired,
  tagsSelected: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      isSelected: PropTypes.bool.isRequired,
    })
  ).isRequired,
  roomId: PropTypes.string.isRequired,
};

const defaultProps = {};

const mapStateToProps = state => ({
  messages: getFilteredMessages(state),
  // tags: getTagsState(state),
  // tagsSelected: getTagsSelectedState(state),
  roomId: state.room.id,
});

const mapDispatchToProps = dispatch => ({
  // actionToggleTag: tagName => dispatch(toggleTag(tagName)),
  // actionGetTagSubscription: roomId => dispatch(getTagSubscription(roomId)),
});

class TagPanel extends React.Component {
  state = {
    unsubscribeTags: null,
  };

  componentDidMount() {
    this.subscribeTags();
  }

  componentWillUnmount() {
    const { unsubscribeTags } = this.state;
    if (unsubscribeTags) {
      unsubscribeTags();
    }
  }

  handleToggleTag = event => {
    const { actionToggleTag } = this.props;
    actionToggleTag(event.currentTarget.value);
  };

  getAvailableTags = () => {
    const { tags, messages } = this.props;
    const messagesTagIds = _.flatten(messages.map(msg => msg.tagIds));
    const availableTags = tags.filter(tag => messagesTagIds.indexOf(tag.id) > -1);
    return availableTags;
  };

  subscribeTags = async () => {
    const { actionGetTagSubscription, roomId } = this.props;
    const unsubscribeTags = await actionGetTagSubscription(roomId);
    this.setState({ unsubscribeTags });
  };

  render() {
    const { tagsSelected } = this.props;

    const hasTagsSelected = tagsSelected.length > 0;

    const tagsList = this.getAvailableTags()
      .sort((a, b) => b.dateLastUsed - a.dateLastUsed)
      .map(tag => {
        const isSelected = hasTagsSelected ? tag.isSelected : true;
        // console.log(tag);
        return (
          <TagItem key={tag.id} onClick={this.handleToggleTag} value={tag.id}>
            <TagHeader isSelected={isSelected} color={tag.color}>
              {tag.name}
            </TagHeader>
          </TagItem>
        );
      });

    return (
      <Wrapper>
        <Scrollable>{tagsList}</Scrollable>
      </Wrapper>
    );
  }
}

TagPanel.propTypes = propTypes;
TagPanel.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TagPanel);
