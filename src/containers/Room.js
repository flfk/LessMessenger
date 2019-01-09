// import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Content from '../components/Content';
import Messages from './Messages';
import MessageInput from './MessageInput';

import { loadMessages } from '../data/messages/messages.actions';

const propTypes = {
  actionLoadMessages: PropTypes.func.isRequired,
};

const defaultProps = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  actionLoadMessages: roomID => dispatch(loadMessages(roomID)),
});

class Room extends React.Component {
  componentDidMount() {
    console.log('room loaded and getting messages');
    const { actionLoadMessages } = this.props;
    actionLoadMessages();
  }

  render() {
    return (
      <Content>
        <Messages />
        <MessageInput />
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
