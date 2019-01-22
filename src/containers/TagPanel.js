// import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Scrollable from '../components/Scrollable';
import { TagHeader, TagItem, Wrapper } from '../components/tagPanel';
import { getTagSubscription, toggleTag } from '../data/tags/tags.actions';

import { getSelectorAll } from '../utils/Helpers';

const propTypes = {
  actionToggleTag: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      isSelected: PropTypes.bool.isRequired,
    })
  ).isRequired,
  roomId: PropTypes.string.isRequired,
};

const defaultProps = {};

const mapStateToProps = state => ({
  tags: getSelectorAll('tags', state),
  roomId: state.room.id,
});

const mapDispatchToProps = dispatch => ({
  actionToggleTag: tagName => dispatch(toggleTag(tagName)),
  actionGetTagSubscription: roomId => dispatch(getTagSubscription(roomId)),
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

  sortTags = (a, b) => {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  };

  subscribeTags = async () => {
    const { actionGetTagSubscription, roomId } = this.props;
    const unsubscribeTags = await actionGetTagSubscription(roomId);
    this.setState({ unsubscribeTags });
  };

  render() {
    const { tags } = this.props;

    const hasTagsSelected = tags.filter(tag => tag.isSelected).length > 0;

    const tagsList = tags.sort(this.sortTags).map(tag => {
      const isSelected = hasTagsSelected ? tag.isSelected : true;
      // console.log(tag);
      return (
        <TagItem key={tag.id} onClick={this.handleToggleTag} value={tag.id}>
          <TagHeader isSelected={isSelected}>{tag.name}</TagHeader>
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
