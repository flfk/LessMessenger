import _ from 'lodash';
import moment from 'moment-timezone';
// import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';

import Content from '../components/Content';
import { MESSAGES_PER_LOAD, MIN_TIME_DIFF_UNTIL_HEADER_MILLIS } from '../utils/Constants';
import Fonts from '../utils/Fonts';
import { getTags, getSelectorAll } from '../utils/Helpers';
import Msg from './Msg';
import { ContainerMsg, Text } from '../components/message';
import { Input, MessagesContainer, PinnedWrapper } from '../components/messagesPanel';
import {
  getMessageSubscription,
  loadMessages,
  togglePinMsg,
} from '../data/messages/messages.actions';
// import { getAllMessages } from '../data/messages/messages.selectors';
import Scrollable from '../components/Scrollable';
import Spinner from '../components/Spinner';
import { toggleTag } from '../data/tags/tags.actions';

const propTypes = {
  actionLoadMessages: PropTypes.func.isRequired,
  actionGetMessageSubscription: PropTypes.func.isRequired,
  actionTogglePin: PropTypes.func.isRequired,
  actionToggleTag: PropTypes.func.isRequired,
  hasMoreMessages: PropTypes.bool.isRequired,
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
      hasAttachment: PropTypes.bool,
      senderUserId: PropTypes.string.isRequired,
      type: PropTypes.string,
      timestamp: PropTypes.number.isRequired,
    })
  ).isRequired,
  roomId: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired, isSelected: PropTypes.bool.isRequired })
  ).isRequired,
  userId: PropTypes.string,
};

const defaultProps = {};

const mapStateToProps = state => ({
  isLoadingMessages: state.room.isLoadingMessages,
  isLoadingMembers: state.room.isLoadingMembers,
  hasMoreMessages: state.messages.hasMoreMessages,
  lastMsgDoc: state.messages.lastMsgDoc,
  members: state.members,
  messages: getSelectorAll('messages', state),
  roomId: state.room.id,
  tags: getSelectorAll('tags', state),
  userId: state.user.id,
});

const mapDispatchToProps = dispatch => ({
  actionLoadMessages: (lastMsgDoc, roomId) => dispatch(loadMessages(lastMsgDoc, roomId)),
  actionTogglePin: (id, isPinned) => dispatch(togglePinMsg(id, isPinned)),
  actionToggleTag: tagName => dispatch(toggleTag(tagName)),
  actionGetMessageSubscription: roomId => dispatch(getMessageSubscription(roomId)),
});

class Messages extends React.Component {
  state = {
    unsubscribeMessages: null,
  };

  componentDidMount() {
    this.subscribeMessages();
    this.scrollToBottom();
  }

  componentDidUpdate(prevProps) {
    const { messages, userId } = this.props;
    const newMsg = messages[messages.length - 1];
    const wasNewMsgAdded = newMsg !== prevProps.messages[prevProps.messages.length - 1];
    if (wasNewMsgAdded && newMsg.senderUserId !== userId) {
      // XX TODO decide how exactly to scroll on new message. Possibly only scroll on someone elses message but not your own.
      this.scrollToBottom();
    }
  }

  componentWillUnmount() {
    const { unsubscribeMessages } = this.state;
    if (unsubscribeMessages) {
      unsubscribeMessages();
    }
  }

  filterTags = msg => {
    const { tags } = this.props;
    const tagsSelected = tags.filter(tag => tag.isSelected);
    const selectedTagNames = tagsSelected.map(tag => tag.name);
    if (selectedTagNames.length === 0) return true;

    let areMsgTagsSelected = true;
    const msgTags = getTags(msg.content);
    selectedTagNames.forEach(tag => {
      areMsgTagsSelected = areMsgTagsSelected && msgTags.indexOf(tag) > -1;
    });
    return areMsgTagsSelected;
  };

  handleTogglePin = id => {
    const { actionTogglePin, messages } = this.props;
    const msg = messages.find(msg => msg.id === id);
    actionTogglePin(id, msg.isPinned);
  };

  handleLoad = () => {
    const { actionLoadMessages, lastMsgDoc, roomId } = this.props;
    actionLoadMessages(lastMsgDoc, roomId);
  };

  getMsgElement = (msg, hasHeader = true) => {
    const { members, messages } = this.props;
    const sender = members.find(member => member.id === msg.senderUserId);

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
        hasHeader={msg.isPinned ? true : hasHeader}
        handleEdit={this.handleEdit}
        handleTogglePin={this.handleTogglePin}
        msg={msg}
        msgBeingRepliedTo={msgBeingRepliedTo ? msgBeingRepliedTo.content : ''}
        senderBeingRepliedTo={senderBeingRepliedTo ? senderBeingRepliedTo.name : ''}
        profileImgURL={sender.profileImgURL}
        selectTag={this.selectTag}
        senderName={sender.name}
      />
    );
  };

  selectTag = id => () => {
    const { actionToggleTag } = this.props;
    actionToggleTag(id);
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
    const { hasMoreMessages, isLoadingMessages, isLoadingMembers, messages } = this.props;

    if (isLoadingMessages || isLoadingMembers) return <Spinner />;

    const messagesFiltered = messages.filter(this.filterTags);

    const msgsPinnedContainer = messagesFiltered
      .filter(msg => msg.isPinned)
      .map(this.getMsgElement);

    const messagesContainer = _.chain(messagesFiltered)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(msg => ({ ...msg, date: moment(msg.timestamp).format('MMM Do') }))
      .groupBy('date')
      .map((group, date) => {
        const msgs = group.map((msg, index) => {
          const isFirstInGroup = index === 0;
          const isNewSender = isFirstInGroup
            ? true
            : !(group[index - 1].senderUserId === msg.senderUserId);
          const timeDiffLastMsg = isFirstInGroup ? 0 : msg.timestamp - group[index - 1].timestamp;
          const hasHeader = isNewSender || timeDiffLastMsg > MIN_TIME_DIFF_UNTIL_HEADER_MILLIS;
          return this.getMsgElement(msg, hasHeader);
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
        <PinnedWrapper>{msgsPinnedContainer}</PinnedWrapper>
        <Scrollable ref={ref => (this.scrollParentRef = ref)}>
          <InfiniteScroll
            getScrollParent={() => this.scrollParentRef}
            hasMore={hasMoreMessages}
            initialLoad={false}
            isReverse
            loader={<Spinner key="InfiniteScrollMessages" />}
            loadMore={this.handleLoad}
            useWindow={false}
          >
            {messagesContainer}
            <div
              style={{ float: 'left', clear: 'both' }}
              ref={el => {
                this.messagesEnd = el;
              }}
            />
          </InfiniteScroll>
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
