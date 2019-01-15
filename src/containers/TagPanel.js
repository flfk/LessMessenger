// import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Scrollable from '../components/Scrollable';
import { TagHeader, TagItem, TagPreview, Wrapper } from '../components/tagPanel';
import { toggleTag } from '../data/tags/tags.actions';

import { getSelectorAll } from '../utils/Helpers';

const propTypes = {
  actionToggleTag: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      isSelected: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

const defaultProps = {};

const mapStateToProps = state => ({
  tags: getSelectorAll('tags', state),
});

const mapDispatchToProps = dispatch => ({
  actionToggleTag: tagName => dispatch(toggleTag(tagName)),
});

class TagPanel extends React.Component {
  state = {};

  handleToggleTag = event => {
    console.log('handling toggle tag', event.currentTarget.value);
    const { actionToggleTag } = this.props;
    actionToggleTag(event.currentTarget.value);
  };

  render() {
    const { tags } = this.props;

    const hasTagsSelected = tags.filter(tag => tag.isSelected).length > 0;

    const tagsList = tags.map(tag => {
      const isSelected = hasTagsSelected ? tag.isSelected : true;
      // console.log(tag);
      return (
        <TagItem key={tag.id} onClick={this.handleToggleTag} value={tag.id}>
          <TagHeader isSelected={isSelected}>{tag.name}</TagHeader>
          <TagPreview>preview</TagPreview>
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
