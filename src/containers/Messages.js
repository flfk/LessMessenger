import _ from 'lodash';
import moment from 'moment-timezone';
// import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Content from '../components/Content';
import Fonts from '../utils/Fonts';
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

    const messagesContainer = _.chain(messages)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(order => ({ ...order, date: moment(order.timestamp).format('MMM Do') }))
      .groupBy('date')
      .map((group, date) => {
        const messages = group.map((msg, index) => {
          const isNewSender =
            index === 0 ? true : !(group[index - 1].senderName === msg.senderName);
          return (
            <Message
              key={msg.timestamp}
              content={msg.content}
              isNewSender={isNewSender}
              senderName={msg.senderName}
              timestamp={msg.timestamp}
            />
          );
        });
        return (
          <div key={date}>
            <Fonts.P centered>
              <strong>{date}</strong>
            </Fonts.P>
            <Content.Spacing16px />
            {messages}
            <Content.Spacing16px />
          </div>
        );
      })
      .value();

    return <div>{messagesContainer}</div>;
  }
}

Messages.propTypes = propTypes;
Messages.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Messages);
