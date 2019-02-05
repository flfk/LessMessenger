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
import Msg from './Msg';
import { Divider, MessagesContainer } from '../components/messagesPanel';
import { getMsgSubscription } from '../data/messages/messages.actions';
import { getFilteredMessages, getMessagesState } from '../data/messages/messages.selectors';
import { getMembersState } from '../data/members/members.selectors';
import { getRoomState } from '../data/room/room.selectors';
import Scrollable from '../components/Scrollable';
import Spinner from '../components/Spinner';
// import { toggleTag } from '../data/tags/tags.actions';
// import { getTagsSelectedState } from '../data/tags/tags.selectors';

const propTypes = {
  actionGetMsgSubscription: PropTypes.func.isRequired,
  hasMoreMessages: PropTypes.bool.isRequired,
  hasLoadedMessages: PropTypes.bool.isRequired,
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
  roomMembers: PropTypes.objectOf(
    PropTypes.shape({
      isOnline: PropTypes.bool.isRequired,
      isTyping: PropTypes.bool.isRequired,
      mostRecentSignOut: PropTypes.number.isRequired,
    }).isRequired
  ).isRequired,
  userId: PropTypes.string.isRequired,
};

const defaultProps = {};

const mapStateToProps = state => ({
  isLoadingMembers: state.members.isLoading,
  hasLoadedMessages: state.messages.hasLoaded,
  hasMoreMessages: state.messages.hasMoreMessages,
  lastMsgDoc: state.messages.lastMsgDoc,
  members: getMembersState(state),
  messages: getMessagesState(state),
  messagesFiltered: getFilteredMessages(state),
  roomId: getRoomState(state).id,
  roomMembers: state.room.members,
  userId: state.user.id,
});

const mapDispatchToProps = dispatch => ({
  actionGetMsgSubscription: (roomId, lastMsgDoc, userId) =>
    dispatch(getMsgSubscription(roomId, lastMsgDoc, userId)),
});

class Messages extends React.Component {
  state = {
    hasRenderedInitialMessages: false,
    subscriptions: [],
  };

  componentDidMount() {
    this.subscribeMessages();
  }

  componentDidUpdate(prevProps) {
    const prevNewestMsg = prevProps.messagesFiltered[prevProps.messagesFiltered.length - 1];
    this.handleScrolling(prevNewestMsg);
  }

  componentWillUnmount() {
    const { subscriptions } = this.state;
    subscriptions.map(sub => sub());
  }

  handleLoad = () => {
    const { hasMoreMessages, lastMsgDoc } = this.props;
    if (hasMoreMessages) this.subscribeMessages(lastMsgDoc);
  };

  handleScrolling = prevNewestMsg => {
    const { hasRenderedInitialMessages } = this.state;
    const { messages, messagesFiltered, userId } = this.props;
    const newMsg = messagesFiltered[messagesFiltered.length - 1];
    const wasNewMsgAdded = newMsg && prevNewestMsg ? newMsg.id !== prevNewestMsg.id : false;
    if (!hasRenderedInitialMessages) {
      this.scrollToNewMessages();
    } else if (wasNewMsgAdded && newMsg && newMsg.senderUserId !== userId) {
      this.scrollToBottom();
    }

    if (!hasRenderedInitialMessages && messages.length === MESSAGES_PER_LOAD + 1) {
      this.setState({ hasRenderedInitialMessages: true });
    }
  };

  getMsgElement = (msg, hasHeader = true) => {
    const { members, messages } = this.props;
    const sender = members.find(member => member.id === msg.senderUserId);
    if (!sender) return null;

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
        // handleTogglePin={this.handleTogglePin}
        msg={msg}
        msgBeingRepliedTo={msgBeingRepliedTo ? msgBeingRepliedTo.content : ''}
        senderBeingRepliedTo={senderBeingRepliedTo ? senderBeingRepliedTo.name : ''}
        profileImgURL={sender.avatar.profileImgURL}
        // selectTag={this.selectTag}
        senderName={sender.name}
      />
    );
  };

  getMessagesByDateElement = messages =>
    _.chain(messages)
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
            <Fonts.P isTertiary isCentered>
              <strong>{date}</strong>
            </Fonts.P>
            <Content.Spacing16px />
            {msgs}
            <Content.Spacing16px />
          </div>
        );
      })
      .value();

  subscribeMessages = async (lastMsgDoc = null) => {
    const { subscriptions } = this.state;
    const { actionGetMsgSubscription, roomId, userId } = this.props;
    const newSub = await actionGetMsgSubscription(roomId, lastMsgDoc, userId);
    const subscriptionsUpdated = [...subscriptions, newSub];
    this.setState({ subscriptions: subscriptionsUpdated });
  };

  scrollToNewMessages = () => {
    if (this.newMessagesEl) {
      this.newMessagesEl.scrollIntoView(true);
    }
  };

  scrollToBottom = () => {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({ behavior: 'auto' });
    }
  };

  render() {
    const { newMessagesSpacerHeight } = this.state;
    const {
      hasMoreMessages,
      hasLoadedMessages,
      messagesFiltered,
      roomMembers,
      userId,
    } = this.props;

    if (!hasLoadedMessages) return null;

    const mostRecentSignOut = roomMembers[userId].mostRecentSignOut || 0;
    const messagesOld = messagesFiltered.filter(msg => msg.timestamp < mostRecentSignOut);
    const messagesNew = messagesFiltered.filter(msg => msg.timestamp >= mostRecentSignOut);

    const messagesOldElement = this.getMessagesByDateElement(messagesOld);
    const messagesWrapperHeight =
      (this.newMessagesEl && this.newMessagesEl.parentElement.parentElement.clientHeight) || 568;
    const messagesNewElement = (
      <div
        ref={newMessagesEl => (this.newMessagesEl = newMessagesEl)}
        style={{
          minHeight: `${messagesWrapperHeight}px`,
        }}
      >
        <Divider text="New messages" />
        {this.getMessagesByDateElement(messagesNew)}
      </div>
    );

    return (
      <MessagesContainer>
        <Scrollable ref={ref => (this.scrollParentRef = ref)}>
          <InfiniteScroll
            getScrollParent={() => this.scrollParentRef}
            hasMore={hasMoreMessages}
            initialLoad={false}
            isReverse
            loader={<Spinner key="InfiniteScrollMessages" />}
            loadMore={this.handleLoad}
            useWindow={false}
            threshold={10}
          >
            {messagesOldElement}
            {messagesNewElement}
            <div
              style={{
                width: '100%',
                height: `${newMessagesSpacerHeight}px`,
              }}
            />
            <div
              style={{ float: 'left', clear: 'both' }}
              ref={messagesEnd => {
                this.messagesEnd = messagesEnd;
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
