// import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Message from '../components/Message';

const propTypes = {};

const defaultProps = {};

const mapStateToProps = state => ({
  messages: state.messages,
});

const mapDispatchToProps = dispatch => ({});

class Messages extends React.Component {
  state = {};

  render() {
    const { messages } = this.props;

    // XX TODO: sort by timestamp
    // break into sections by day
    const messagesContainer = messages
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(msg => (
        <Message
          key={msg.timestamp}
          content={msg.content}
          senderName={msg.senderName}
          timestamp={msg.timestamp}
        />
      ));

    return <div>{messagesContainer}</div>;
  }
}

Messages.propTypes = propTypes;
Messages.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Messages);
