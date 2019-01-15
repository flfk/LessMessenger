import _ from 'lodash';
import moment from 'moment-timezone';
// import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Content from '../components/Content';
import { MIN_TIME_DIFF_UNTIL_HEADER_MILLIS } from '../utils/Constants';
import Fonts from '../utils/Fonts';
import { getTags } from '../utils/Helpers';
import Msg from './Msg';
import { MessagesContainer } from '../components/messagesPanel';
import { getMessageSubscription } from '../data/messages/messages.actions';
// import { getAllMessages } from '../data/messages/messages.selectors';
import { getSelectorAll } from '../utils/Helpers';
import Scrollable from '../components/Scrollable';
import Spinner from '../components/Spinner';
import { toggleTag } from '../data/tags/tags.actions';

const propTypes = {
  actionGetMessageSubscription: PropTypes.func.isRequired,
  actionToggleTag: PropTypes.func.isRequired,
  isLoadingMessages: PropTypes.bool.isRequired,
  isLoadingMembers: PropTypes.bool.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired,
      downloadURL: PropTypes.string,
      isAttachment: PropTypes.bool,
      senderUserId: PropTypes.string.isRequired,
      type: PropTypes.string,
      timestamp: PropTypes.number.isRequired,
    })
  ).isRequired,
  roomId: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired, isSelected: PropTypes.bool.isRequired })
  ).isRequired,
};

const defaultProps = {};

const mapStateToProps = state => ({
  isLoadingMessages: state.room.isLoadingMessages,
  isLoadingMembers: state.room.isLoadingMembers,
  members: state.members,
  messages: getSelectorAll('messages', state),
  roomId: state.room.id,
  tags: getSelectorAll('tags', state),
});

const mapDispatchToProps = dispatch => ({
  actionToggleTag: tagName => dispatch(toggleTag(tagName)),
  actionGetMessageSubscription: roomId => dispatch(getMessageSubscription(roomId)),
});

class Messages extends React.Component {
  state = {
    unsubscribeMessages: null,
  };

  componentDidMount() {
    this.subscribeMessages();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    const { unsubscribeMessages } = this.state;
    if (unsubscribeMessages) {
      unsubscribeMessages();
    }
  }

  selectTag = tagName => () => {
    const { actionToggleTag } = this.props;
    actionToggleTag(tagName.toLowerCase());
  };

  subscribeMessages = async () => {
    const { actionGetMessageSubscription, roomId } = this.props;
    const unsubscribeMessages = await actionGetMessageSubscription(roomId);
    this.setState({ unsubscribeMessages });
  };

  scrollToBottom = () => {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({ behavior: 'auto' });
    }
  };

  render() {
    const { isLoadingMessages, isLoadingMembers, members, messages, tags } = this.props;

    if (isLoadingMessages || isLoadingMembers) return <Spinner />;

    const tagsSelected = tags.filter(tag => tag.isSelected);
    const selectedTagNames = tagsSelected.map(tag => tag.name);

    const messagesFiltered =
      selectedTagNames.length === 0
        ? messages
        : messages.filter(msg => {
            let isMsgTagSelected = false;
            const msgTags = getTags(msg.content);
            msgTags.forEach(msgTag => {
              isMsgTagSelected = isMsgTagSelected || selectedTagNames.indexOf(msgTag) > -1;
            });
            return isMsgTagSelected;
          });

    const messagesContainer = _.chain(messagesFiltered)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(msg => ({ ...msg, date: moment(msg.timestamp).format('MMM Do') }))
      .groupBy('date')
      .map((group, date) => {
        const msgs = group.map((msg, index) => {
          const sender = members.find(member => member.id === msg.senderUserId);
          const isFirstInGroup = index === 0;
          const isNewSender = isFirstInGroup
            ? true
            : !(group[index - 1].senderUserId === msg.senderUserId);
          const timeDiffLastMsg = isFirstInGroup ? 0 : msg.timestamp - group[index - 1].timestamp;
          const hasHeader = isNewSender || timeDiffLastMsg > MIN_TIME_DIFF_UNTIL_HEADER_MILLIS;

          let msgBeingRepliedTo = {};
          let senderBeingRepliedTo = {};
          if (msg.msgIdBeingRepliedTo) {
            msgBeingRepliedTo = messages.find(item => item.id === msg.msgIdBeingRepliedTo);
            senderBeingRepliedTo = msgBeingRepliedTo
              ? members.find(member => member.id === msgBeingRepliedTo.senderUserId)
              : null;
          }

          return (
            <Msg
              key={msg.id}
              content={msg.content}
              downloadURL={msg.downloadURL}
              hasHeader={hasHeader}
              id={msg.id}
              isAttachment={msg.isAttachment}
              msgBeingRepliedTo={msgBeingRepliedTo ? msgBeingRepliedTo.content : ''}
              senderBeingRepliedTo={senderBeingRepliedTo ? senderBeingRepliedTo.name : ''}
              profileImgURL={sender.profileImgURL}
              selectTag={this.selectTag}
              senderName={sender.name}
              timestamp={msg.timestamp}
              type={msg.type}
            />
          );
        });
        return (
          <div key={date}>
            <Fonts.P centered>
              <strong>{date}</strong>
            </Fonts.P>
            <Content.Spacing16px />
            {msgs}
            <Content.Spacing16px />
          </div>
        );
      })
      .value();

    return (
      <MessagesContainer>
        <Scrollable alignBottom>
          {messagesContainer}
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={el => {
              this.messagesEnd = el;
            }}
          />
        </Scrollable>
      </MessagesContainer>
    );
  }
}

Messages.propTypes = propTypes;
Messages.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Messages);
