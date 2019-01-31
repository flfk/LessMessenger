import PropTypes from 'prop-types';
import React from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';

import { REGEX_TIMER, TYPING_TIMEOUT_MILLIS } from '../utils/Constants';
import Messages from './Messages';
// import { createTag } from '../data/tags/tags.actions';
import { cancelReply, sendMessage, uploadFile } from '../data/messages/messages.actions';
import { getMessagesState } from '../data/messages/messages.selectors';
import { getMembersState } from '../data/members/members.selectors';
import { AnimationInOffice, Container, Thumbnails, Input } from '../components/messagesPanel';
import { Text } from '../components/message';
import { updateMostRecentSignIn } from '../data/room/room.actions';
import { getRoomState } from '../data/room/room.selectors';
import { toggleIsTyping } from '../data/user/user.actions';
// import { getTagsState, getTagsSelectedState } from '../data/tags/tags.selectors';

// import { getSelectorAll } from '../utils/Helpers';

const propTypes = {
  actionCancelReply: PropTypes.func.isRequired,
  // actionCreateTag: PropTypes.func.isRequired,
  actionSendMessage: PropTypes.func.isRequired,
  actionToggleIsTyping: PropTypes.func.isRequired,
  isTyping: PropTypes.bool.isRequired,
  msgIdBeingRepliedTo: PropTypes.string.isRequired,
  roomId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  // tags: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     name: PropTypes.string.isRequired,
  //     isSelected: PropTypes.bool.isRequired,
  //   })
  // ).isRequired,
  // tagsSelected: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     name: PropTypes.string.isRequired,
  //     isSelected: PropTypes.bool.isRequired,
  //   })
  // ).isRequired,
};

const defaultProps = {};

const mapStateToProps = state => ({
  isTyping: state.user.isTyping,
  messages: getMessagesState(state),
  members: getMembersState(state),
  msgIdBeingRepliedTo: state.room.msgIdBeingRepliedTo,
  roomId: getRoomState(state).id,
  userId: state.user.id,
  // tags: getTagsState(state),
  // tagsSelected: getTagsSelectedState(state),
});

const mapDispatchToProps = dispatch => ({
  actionCancelReply: () => dispatch(cancelReply()),
  // actionCreateTag: (roomId, tagName) => dispatch(createTag(roomId, tagName)),
  actionSendMessage: (message, tags) => dispatch(sendMessage(message, tags)),
  actionToggleIsTyping: (id, isTyping, roomId) => dispatch(toggleIsTyping(id, isTyping, roomId)),
});

class MessagePanel extends React.Component {
  state = {
    msgInput: '',
    files: [],
    isTyping: false,
    typingTimeout: null,
  };

  componentDidMount() {
    document.onpaste = this.onPaste;
    const { roomId, userId } = this.props;
    updateMostRecentSignIn(roomId, userId);
  }

  // componentDidUpdate(prevProps, prevState) {
  //   const { tagsSelected } = this.props;
  //   const { msgInput } = this.state;
  //   const tagsSelectedPrev = prevProps.tagsSelected;
  //   const msgInputPrev = prevState.msgInput;
  //   const wasMsgSent = msgInputPrev && !msgInput;
  //   If a tag was added or if message was sent
  //   if (tagsSelectedPrev.length !== tagsSelected.length || wasMsgSent) {
  //     this.setTagHelpers(tagsSelectedPrev, wasMsgSent);
  //   }
  // }

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
    // const tagIds = await this.getTagIds(content);
    return {
      content,
      // isPinned: false,
      hasAttachment: false,
      hasTimer,
      msgIdBeingRepliedTo,
      roomId,
      savesByUserId: [],
      senderUserId: userId,
      // tagIds added in actions
      // Timestamp added in actions based on server
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
  };

  // To allows form to be submitted using enter key
  handleKeyPress = event => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();
      this.handleSubmit();
    }
  };

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

  // setTagHelpers = (tagsSelectedPrev, wasMsgSent) => {
  //   const { tagsSelected } = this.props;
  //   const { msgInput } = this.state;

  //   const tagNamesPrev = tagsSelectedPrev.map(tag => tag.name);
  //   const tagNamesCurrent = tagsSelected.map(tag => tag.name);
  //   let msgInputUpdated = msgInput.trim();

  //   if (wasMsgSent) {
  //     tagNamesCurrent.forEach(tag => {
  //       msgInputUpdated = `${tag} ${msgInputUpdated}`;
  //     });
  //   } else {
  //     const tagNamesAdded = tagNamesCurrent.filter(tag => !(tagNamesPrev.indexOf(tag) > -1));
  //     const tagNamesRemoved = tagNamesPrev.filter(tag => !(tagNamesCurrent.indexOf(tag) > -1));
  //     tagNamesAdded.forEach(tag => {
  //       msgInputUpdated = `${tag} ${msgInputUpdated}`;
  //     });
  //     tagNamesRemoved.forEach(tag => {
  //       const isTagInInput = msgInputUpdated.indexOf(tag) > -1;
  //       if (isTagInInput) {
  //         msgInputUpdated = msgInputUpdated.replace(tag, '');
  //       }
  //     });
  //   }

  //   this.setState({ msgInput: msgInputUpdated });
  // };

  render() {
    const { files, msgInput } = this.state;
    const { isTyping, members, msgIdBeingRepliedTo, roomId, userId } = this.props;

    const thumbnails = files.map(file => {
      if (file.type.startsWith('image/')) {
        return <Thumbnails.Img key={file.name} src={file.preview} alt="File preview" />;
      }
      return <Thumbnails.File key={file.name}>{file.name}</Thumbnails.File>;
    });

    let reply = null;
    const msgBeingRepliedTo = this.getMsg(msgIdBeingRepliedTo);
    const senderBeingRepliedTo = msgBeingRepliedTo
      ? members.find(member => member.id === msgBeingRepliedTo.senderUserId)
      : null;
    if (msgBeingRepliedTo && senderBeingRepliedTo) {
      reply = (
        <Text.Reply>{`${senderBeingRepliedTo.name}: ${msgBeingRepliedTo.content}`}</Text.Reply>
      );
    }

    const animations = members
      // .filter(member => member.id !== userId)
      .map(member => (
        <AnimationInOffice
          key={member.id}
          avatar={member.avatar}
          isOnline={member.isOnline}
          isTyping={
            member.isTypingByRoomId && member.isTypingByRoomId[roomId]
              ? member.isTypingByRoomId[roomId]
              : false
          }
        />
      ));

    return (
      <Container>
        <Dropzone onDrop={this.onDrop} onFileDialogCancel={this.onCancel}>
          {({ getRootProps }) => (
            <div {...getRootProps()} style={{ display: 'flex', flexDirection: 'column' }}>
              <Messages />
              <AnimationInOffice.Wrapper>{animations}</AnimationInOffice.Wrapper>
              <Input.Wrapper>
                {reply}
                <Thumbnails.Container>{thumbnails}</Thumbnails.Container>
                <Input
                  type="text"
                  placeholder="Type a message..."
                  onChange={this.handleChangeMsgInput}
                  value={msgInput}
                  onKeyDown={this.handleKeyPress}
                  maxRows={10}
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
