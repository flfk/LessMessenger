// import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Content from '../components/Content';
import Messages from './Messages';
import MessageInput from './MessageInput';

import { addMessage } from '../data/messages/messages.actions';

const propTypes = {};

const defaultProps = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  actionAddMessage: message => dispatch(addMessage(message)),
});

class Room extends React.Component {
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
