// import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Content from '../components/Content';
import { getTimestamp } from '../utils/Helpers';
import Message from '../components/Message';
import MessageInput from '../components/MessageInput';

const propTypes = {
  senderName: PropTypes.string.isRequired,
};

const defaultProps = {};

const mapStateToProps = state => ({
  senderName: state.user.displayName,
});

const mapDispatchToProps = dispatch => ({});

class Room extends React.Component {
  state = {
    messageInput: '',
    messages: [
      { content: 'testng', senderName: 'Felix', timestamp: 1546989457516 },
      { content: 'testing', senderName: 'Felix', timestamp: 1546989357516 },
    ],
  };

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

  handleSend = () => {
    const { messageInput, messages } = this.state;
    const { senderName } = this.props;
    if (messageInput) {
      const messagesUpdated = messages.slice();
      const newMsg = {
        content: messageInput,
        senderName,
        timestamp: getTimestamp(),
      };
      messagesUpdated.push(newMsg);
      this.setState({ messages: messagesUpdated, messageInput: '' });
    }
  };

  render() {
    const { messageInput, messages } = this.state;

    const messagesContainer = messages.map(msg => (
      <Message
        key={msg.timestamp}
        content={msg.content}
        senderName={msg.senderName}
        timestamp={msg.timestamp}
      />
    ));

    return (
      <Content>
        {messagesContainer}
        <MessageInput
          handleSend={this.handleSend}
          placeholder="Type a message..."
          onChange={this.handleChangeInput('messageInput')}
          value={messageInput}
        />
      </Content>
    );
  }
}

Room.propTypes = propTypes;
Room.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Room);
