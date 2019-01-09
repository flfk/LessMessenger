// import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { Input, InputContainer } from '../components/MessagesPanel';
import { getTimestamp } from '../utils/Helpers';

import { sendMessage } from '../data/messages/messages.actions';

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

class MessageInput extends React.Component {
  state = {
    message: '',
  };

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

  handleSubmit = () => {
    const { message } = this.state;
    const { actionSendMessage, senderName, roomID } = this.props;
    if (message) {
      const newMessage = {
        content: message,
        roomID,
        senderName,
        timestamp: getTimestamp(),
      };
      actionSendMessage(newMessage);
      this.setState({ message: '' });
    }
  };

  // To allows form to be submitted using enter key
  handleKeyPress = event => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();
      this.handleSubmit();
    }
  };

  render() {
    const { message } = this.state;
    return (
      <InputContainer>
        <form onSubmit={this.handleSubmit}>
          <Input
            type="text"
            placeholder="Type a message..."
            onChange={this.handleChangeInput('message')}
            value={message}
            onKeyDown={this.handleKeyPress}
          />
        </form>
      </InputContainer>
    );
  }
}

MessageInput.propTypes = propTypes;
MessageInput.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageInput);
