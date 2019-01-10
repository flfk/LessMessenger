import PropTypes from 'prop-types';
import React from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';

import Messages from './Messages';
import { sendMessage } from '../data/messages/messages.actions';
import { Container, Thumbnails, Input, InputContainer } from '../components/MessagesPanel';

const propTypes = {
  actionSendMessage: PropTypes.func.isRequired,
  roomID: PropTypes.string.isRequired,
  senderName: PropTypes.string.isRequired,
};

const defaultProps = {};

const mapStateToProps = state => ({
  messages: state.messages,
  roomID: state.room.id,
  senderName: state.user.id,
});

const mapDispatchToProps = dispatch => ({
  actionSendMessage: message => dispatch(sendMessage(message)),
});

class MessagePanel extends React.Component {
  state = {
    message: '',
    files: [],
  };

  getNewMsg = content => {
    const { senderName, roomID } = this.props;
    return {
      content,
      roomID,
      senderName,
      // Timestamp added in actions based on server
    };
  };

  getAttachmentFields = file => ({
    isAttachment: true,
    downloadURL: '',
    type: file.type,
  });

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

  handleSubmit = () => {
    const { files, message } = this.state;
    console.log('files', files);
    const { actionSendMessage } = this.props;

    if (message) {
      const newMsg = this.getNewMsg(message);
      actionSendMessage(newMsg);
      this.setState({ message: '' });
    }

    if (files.length > 0) {
      console.log('files exist');
      files.forEach(file => {
        const newMsg = this.getNewMsg(file.name);
        const attachmentFields = this.getAttachmentFields(file);
        console.log('attachment message', { ...newMsg, ...attachmentFields });
      });

      this.setState({ files: [] });
    }
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

    const thumbnails = files.map(file => {
      if (file.type.startsWith('image/')) {
        return <Thumbnails.Img key={file.name} src={file.preview} alt="File preview" />;
      }
      return <Thumbnails.File key={file.name}>{file.name}</Thumbnails.File>;
    });

    return (
      <Container>
        <Dropzone onDrop={this.onDrop} onFileDialogCancel={this.onCancel}>
          {({ getRootProps }) => (
            <div {...getRootProps()}>
              <Messages />
              <Thumbnails.Container>{thumbnails}</Thumbnails.Container>
              <InputContainer>
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
