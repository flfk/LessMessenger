import PropTypes from 'prop-types';
import React from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';

import Messages from './Messages';
import { cancelReply, sendMessage, uploadFile } from '../data/messages/messages.actions';
import { Container, Thumbnails, Input, InputContainer } from '../components/messagesPanel';
import { ContainerMsg, Text } from '../components/message';

import { getSelectorAll } from '../utils/Helpers';

const propTypes = {
  actionCancelReply: PropTypes.func.isRequired,
  actionSendMessage: PropTypes.func.isRequired,
  msgIdBeingRepliedTo: PropTypes.string.isRequired,
  roomId: PropTypes.string.isRequired,
  senderUserId: PropTypes.string.isRequired,
};

const defaultProps = {};

const mapStateToProps = state => ({
  messages: getSelectorAll('messages', state),
  members: state.members,
  msgIdBeingRepliedTo: state.room.msgIdBeingRepliedTo,
  roomId: state.room.id,
  senderUserId: state.user.id,
});

const mapDispatchToProps = dispatch => ({
  actionCancelReply: () => dispatch(cancelReply()),
  actionSendMessage: message => dispatch(sendMessage(message)),
});

class MessagePanel extends React.Component {
  state = {
    message: '',
    files: [],
  };

  getMsg = msgId => {
    const { messages } = this.props;
    const msg = messages.find(item => item.id === msgId);
    return msg;
  };

  getNewMsg = content => {
    const { senderUserId, roomId, msgIdBeingRepliedTo } = this.props;
    return {
      content,
      isPinned: false,
      hasTimer: false,
      msgIdBeingRepliedTo,
      roomId,
      senderUserId,
      // Timestamp added in actions based on server
    };
  };

  getAttachmentFields = (downloadURL, file) => ({
    isAttachment: true,
    downloadURL,
    type: file.type,
  });

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

  handleSubmit = async () => {
    const { files, message } = this.state;
    const { actionCancelReply, actionSendMessage, roomId } = this.props;

    if (message) {
      const newMsg = this.getNewMsg(message);
      actionSendMessage(newMsg);
      this.setState({ message: '' });
    }

    if (files.length > 0) {
      await Promise.all(
        files.map(async file => {
          const newMsg = this.getNewMsg(file.name);
          this.setState({ files: [] });
          const uploadTask = await uploadFile(file, roomId);
          console.log('uploadTask', uploadTask);
          const downloadURL = await uploadTask.ref.getDownloadURL();
          const attachmentFields = this.getAttachmentFields(downloadURL, file);
          console.log('attachment message', { ...newMsg, ...attachmentFields });
          actionSendMessage({ ...newMsg, ...attachmentFields });
        })
      );
    }

    // remove Id of message being replied to
    actionCancelReply();
  };

  // To allows form to be submitted using enter key
  handleKeyPress = event => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();
      this.handleSubmit();
    }
  };

  onDrop = filesDropped => {
    console.log(filesDropped);
    const { files } = this.state;
    const filesUpdated = files.slice();
    filesDropped.map(file => {
      filesUpdated.push(
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
    });
    this.setState({ files: filesUpdated });
  };

  onCancel = () => {
    this.setState({
      files: [],
    });
  };

  render() {
    const { files, message } = this.state;
    const { messages, members, msgIdBeingRepliedTo } = this.props;

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

    return (
      <Container>
        <Dropzone onDrop={this.onDrop} onFileDialogCancel={this.onCancel}>
          {({ getRootProps }) => (
            <div {...getRootProps()}>
              <Messages />
              <InputContainer>
                {reply}
                <Thumbnails.Container>{thumbnails}</Thumbnails.Container>
                <Input
                  type="text"
                  placeholder="Type a message..."
                  onChange={this.handleChangeInput('message')}
                  value={message}
                  onKeyDown={this.handleKeyPress}
                />
              </InputContainer>
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
