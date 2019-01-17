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
import { WrapperEditMsg } from '../components/message';
import { Input, MessagesContainer, PinnedWrapper } from '../components/messagesPanel';
import {
  getMessageSubscription,
  loadMessages,
  togglePinMsg,
  editMsg,
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
  actionEditMsg: PropTypes.func.isRequired,
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
});

const mapDispatchToProps = dispatch => ({
  actionLoadMessages: (lastMsgDoc, roomId) => dispatch(loadMessages(lastMsgDoc, roomId)),
  actionTogglePin: (id, isPinned) => dispatch(togglePinMsg(id, isPinned)),
  actionToggleTag: tagName => dispatch(toggleTag(tagName)),
  actionGetMessageSubscription: roomId => dispatch(getMessageSubscription(roomId)),
  actionEditMsg: msg => dispatch(editMsg(msg)),
});

class Messages extends React.Component {
  state = {
    unsubscribeMessages: null,
    msgToEditId: '',
    msgToEditInput: '',
  };

  componentDidMount() {
    this.subscribeMessages();
    this.scrollToBottom();
    console.log('component mounted, scroll');
  }

  componentDidUpdate(prevProps) {
    const { messages } = this.props;
    const wasNewMsgAdded =
      messages[messages.length - 1] !== prevProps.messages[prevProps.messages.length - 1];
    if (wasNewMsgAdded) {
      this.scrollToBottom();
    }
  }

  componentWillUnmount() {
    const { unsubscribeMessages } = this.state;
    if (unsubscribeMessages) {
      unsubscribeMessages();
    }
  }

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

  handleEdit = id => {
    const { messages } = this.props;
    const msgToEdit = messages.find(msg => msg.id === id);
    this.setState({ msgToEditId: id, msgToEditInput: msgToEdit.content });
  };

  handleEditCancel = () => this.setState({ msgToEditId: '', msgToEditInput: '' });

  handleEditSave = () => {
    const { msgToEditId, msgToEditInput } = this.state;
    const { actionEditMsg, messages } = this.props;
    const msgToEdit = messages.find(msg => msg.id === msgToEditId);
    actionEditMsg({ ...msgToEdit, content: msgToEditInput });
    this.handleEditCancel();
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
    const { msgToEditId, msgToEditInput } = this.state;

    const {
      hasMoreMessages,
      isLoadingMessages,
      isLoadingMembers,
      members,
      messages,
      tags,
    } = this.props;

    if (isLoadingMessages || isLoadingMembers) return <Spinner />;

    const tagsSelected = tags.filter(tag => tag.isSelected);
    const selectedTagNames = tagsSelected.map(tag => tag.name);

    const messagesFiltered =
      selectedTagNames.length === 0
        ? messages
        : messages.filter(msg => {
            let areMsgTagsSelected = true;
            const msgTags = getTags(msg.content);
            selectedTagNames.forEach(tag => {
              areMsgTagsSelected = areMsgTagsSelected && msgTags.indexOf(tag) > -1;
            });
            return areMsgTagsSelected;
          });

    const msgsPinnedContainer = messagesFiltered
      .filter(msg => msg.isPinned)
      .map(msg => {
        const sender = members.find(member => member.id === msg.senderUserId);
        return (
          <Msg
            key={msg.id}
            content={msg.content}
            downloadURL={msg.downloadURL}
            fileName={msg.fileName}
            hasAttachment={msg.hasAttachment}
            hasHeader
            hasTimer={msg.hasTimer}
            handleEdit={this.handleEdit}
            handleTogglePin={this.handleTogglePin}
            id={msg.id}
            // isAttachment={msg.isAttachment}
            isPinned
            profileImgURL={sender.profileImgURL}
            selectTag={this.selectTag}
            senderName={sender.name}
            timestamp={msg.timestamp}
            type={msg.type}
          />
        );
      });

    const messagesContainer = _.chain(messagesFiltered)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(msg => ({ ...msg, date: moment(msg.timestamp).format('MMM Do') }))
      .groupBy('date')
      .map((group, date) => {
        const msgs = group.map((msg, index) => {
          // add editing as a feature
          if (msg.id === msgToEditId) {
            return (
              <WrapperEditMsg key={msg.id}>
                <Input
                  type="text"
                  placeholder="Type a message..."
                  onChange={this.handleChangeInput('msgToEditInput')}
                  value={msgToEditInput}
                />
                <div>
                  <button type="button" onClick={this.handleEditSave}>
                    Save
                  </button>
                  <button type="button" onClick={this.handleEditCancel}>
                    Cancel
                  </button>
                </div>
              </WrapperEditMsg>
            );
          }

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
              fileName={msg.fileName}
              hasAttachment={msg.hasAttachment}
              hasHeader={hasHeader}
              hasTimer={msg.hasTimer}
              handleEdit={this.handleEdit}
              handleTogglePin={this.handleTogglePin}
              id={msg.id}
              // isAttachment={msg.isAttachment}
              isPinned={false}
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
