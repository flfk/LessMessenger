import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';

import { REGEX_TIMER, TYPING_TIMEOUT_MILLIS } from '../utils/Constants';
import Fonts from '../utils/Fonts';
import Messages from './Messages';
// import { createTag } from '../data/tags/tags.actions';
import { cancelReply, sendMessage, uploadFile } from '../data/messages/messages.actions';
import { getMessagesState } from '../data/messages/messages.selectors';
import { getMembersState } from '../data/members/members.selectors';
import {
  AnimationInOffice,
  CancelBtn,
  Container,
  Thumbnails,
  Input,
} from '../components/messagesPanel';
import { Text } from '../components/message';
import { updateMostRecentSignIn } from '../data/room/room.actions';
import { getRoomState } from '../data/room/room.selectors';
import { toggleIsTyping } from '../data/user/user.actions';

const propTypes = {
  actionCancelReply: PropTypes.func.isRequired,
  actionSendMessage: PropTypes.func.isRequired,
  actionToggleIsTyping: PropTypes.func.isRequired,
  isTyping: PropTypes.bool.isRequired,
  msgIdBeingRepliedTo: PropTypes.string.isRequired,
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
  isTyping: state.user.isTyping,
  messages: getMessagesState(state),
  members: getMembersState(state),
  msgIdBeingRepliedTo: state.room.msgIdBeingRepliedTo,
  roomId: getRoomState(state).id,
  roomMembers: state.room.members,
  userId: state.user.id,
});

const mapDispatchToProps = dispatch => ({
  actionCancelReply: () => dispatch(cancelReply()),
  actionSendMessage: (message, tags) => dispatch(sendMessage(message, tags)),
  actionToggleIsTyping: (id, isTyping, roomId) => dispatch(toggleIsTyping(id, isTyping, roomId)),
});

class MessagePanel extends React.Component {
  state = {
    msgInput: '',
    files: [],
    typingTimeout: null,
  };

  componentDidMount() {
    document.onpaste = this.onPaste;
    const { roomId, userId } = this.props;
    updateMostRecentSignIn(roomId, userId);
  }

  componentWillUnmount() {
    this.clearTypingTimeout();
  }

  clearTypingTimeout = () => {
    const { typingTimeout } = this.state;
    if (typingTimeout) clearTimeout(typingTimeout);
  };

  createFileObj = file =>
    Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

  getAttachmentFields = (downloadURL, file) => ({
    downloadURL,
    fileName: file.name,
    hasAttachment: true,
    type: file.type,
  });

  getMsg = msgId => {
    const { messages } = this.props;
    const msg = messages.find(item => item.id === msgId);
    return msg;
  };

  getNewMsg = async content => {
    const { userId, roomId, msgIdBeingRepliedTo } = this.props;
    const hasTimer = content.match(REGEX_TIMER) !== null;
    return {
      content,
      hasAttachment: false,
      hasTimer,
      msgIdBeingRepliedTo,
      roomId,
      savesByUserId: [],
      seenByUserId: [userId],
      senderUserId: userId,
    };
  };

  handleChangeMsgInput = event => {
    this.setState({ msgInput: event.target.value });
    this.resetTypingTimeout();
  };

  handleSubmit = async () => {
    const { files, msgInput } = this.state;
    const { actionCancelReply, actionSendMessage, msgIdBeingRepliedTo, roomId, tags } = this.props;

    const newMsg = await this.getNewMsg(msgInput);
    this.setState({ files: [], msgInput: '' });
    if (files.length > 0) {
      await Promise.all(
        files.map(async file => {
          const uploadTask = await uploadFile(file, roomId);
          const downloadURL = await uploadTask.ref.getDownloadURL();
          const attachmentFields = this.getAttachmentFields(downloadURL, file);
          actionSendMessage({ ...newMsg, ...attachmentFields }, tags);
        })
      );
    } else {
      actionSendMessage(newMsg, tags);
    }
    if (msgIdBeingRepliedTo) actionCancelReply();
    mixpanel.track('Sent Message', { roomId });
  };

  // To allows form to be submitted using enter key
  handleKeyPress = event => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();
      this.handleSubmit();
    }
  };

  handleCancelFile = name => {
    const { files } = this.state;
    const fileIndex = files.map(file => file.name).indexOf(name);
    if (fileIndex > -1) {
      const filesUpdated = files.slice();
      filesUpdated.splice(fileIndex, 1);
      this.setState({ files: filesUpdated });
    }
  };

  handleCancelReply = () => this.setState({ msgIdBeingRepliedTo: '' });

  onDrop = filesDropped => {
    const { files } = this.state;
    const filesUpdated = files.slice();
    filesDropped.forEach(file => {
      const fileObj = this.createFileObj(file);
      filesUpdated.push(fileObj);
    });
    this.setState({ files: filesUpdated });
  };

  onCancel = () => {
    this.setState({
      files: [],
    });
  };

  onPaste = event => {
    const { files } = event.clipboardData || event.originalEvent.clipboardData;
    if (files.length > 0) {
      event.preventDefault();
      const stateFiles = this.state.files;
      const filesUpdated = stateFiles.slice();
      Array.from(files).forEach(file => {
        const fileObj = this.createFileObj(file);
        filesUpdated.push(fileObj);
      });
      this.setState({ files: filesUpdated });
    }
  };

  resetTypingTimeout = () => {
    const { actionToggleIsTyping, isTyping, roomId, userId } = this.props;
    if (!isTyping) {
      actionToggleIsTyping(userId, true, roomId);
    }
    this.clearTypingTimeout();
    this.setState({
      typingTimeout: setTimeout(
        () => actionToggleIsTyping(userId, false, roomId),
        TYPING_TIMEOUT_MILLIS
      ),
    });
  };

  render() {
    const { files, msgInput } = this.state;
    const { actionCancelReply, members, msgIdBeingRepliedTo, roomMembers, userId } = this.props;

    const thumbnails = files.map(file => {
      if (file.type.startsWith('image/')) {
        return (
          <Thumbnails.ImgWrapper key={file.name}>
            <Thumbnails.Img src={file.preview} alt="File preview" />
            <CancelBtn isImage onClick={() => this.handleCancelFile(file.name)} />
          </Thumbnails.ImgWrapper>
        );
      }
      return (
        <Thumbnails.File key={file.name}>
          <Fonts.P>{file.name}</Fonts.P>
          <CancelBtn onClick={() => this.handleCancelFile(file.name)} />
        </Thumbnails.File>
      );
    });

    let reply = null;
    const msgBeingRepliedTo = this.getMsg(msgIdBeingRepliedTo);
    const senderBeingRepliedTo = msgBeingRepliedTo
      ? members.find(member => member.id === msgBeingRepliedTo.senderUserId)
      : null;
    if (msgBeingRepliedTo && senderBeingRepliedTo) {
      reply = (
        <Text.ReplyWrapper>
          <Text.Reply>{`${senderBeingRepliedTo.name}: ${msgBeingRepliedTo.content}`}</Text.Reply>
          <CancelBtn onClick={actionCancelReply} />
        </Text.ReplyWrapper>
      );
    }

    const animations = members
      .filter(member => member.id !== userId)
      .map(member => (
        <AnimationInOffice
          key={member.id}
          avatar={member.avatar}
          isOnline={roomMembers[member.id].isOnline}
          isTyping={roomMembers[member.id].isTyping}
        />
      ));

    const dropZoneStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      height: '100%',
    };

    return (
      <Container>
        <Dropzone onDrop={this.onDrop} onFileDialogCancel={this.onCancel}>
          {({ getRootProps }) => (
            <div {...getRootProps()} style={dropZoneStyle}>
              <Messages />
              <AnimationInOffice.Wrapper>{animations}</AnimationInOffice.Wrapper>
              <Input.Wrapper>
                {reply}
                <Thumbnails.Container>{thumbnails}</Thumbnails.Container>
                <Input
                  type="text"
                  placeholder="Type a message..."
                  onChange={this.handleChangeMsgInput}
                  id={msgInput}
                  onKeyDown={this.handleKeyPress}
                  maxRows={10}
                  value={msgInput}
                />
              </Input.Wrapper>
            </div>
          )}
        </Dropzone>
      </Container>
    );
  }
}

MessagePanel.propTypes = propTypes;
MessagePanel.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagePanel);
