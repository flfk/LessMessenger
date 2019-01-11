import _ from 'lodash';
import moment from 'moment-timezone';
// import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Content from '../components/Content';
import Fonts from '../utils/Fonts';
import { Message, MessagesContainer } from '../components/MessagesPanel';
import { getMessageSubscription } from '../data/messages/messages.actions';
import Scrollable from '../components/Scrollable';
import Spinner from '../components/Spinner';

const propTypes = {
  actionGetMessageSubscription: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.string.isRequired,
      downloadURL: PropTypes.string,
      isAttachment: PropTypes.bool,
      senderUserID: PropTypes.string.isRequired,
      type: PropTypes.string,
      timestamp: PropTypes.number.isRequired,
    })
  ).isRequired,
  roomID: PropTypes.string.isRequired,
};

const defaultProps = {};

const mapStateToProps = state => ({
  isLoading: state.room.isLoadingMessages,
  members: state.members,
  messages: state.messages,
  roomID: state.room.id,
});

const mapDispatchToProps = dispatch => ({
  actionGetMessageSubscription: roomID => dispatch(getMessageSubscription(roomID)),
});

class Messages extends React.Component {
  state = {
    unsubscribeMessages: null,
  };

  componentDidMount() {
    this.subscribeMessages();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    const { unsubscribeMessages } = this.state;
    if (unsubscribeMessages) {
      unsubscribeMessages();
    }
  }

  subscribeMessages = async () => {
    const { actionGetMessageSubscription, roomID } = this.props;
    const unsubscribeMessages = await actionGetMessageSubscription(roomID);
    this.setState({ unsubscribeMessages });
  };

  scrollToBottom = () => {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({ behavior: 'auto' });
    }
  };

  render() {
    const { isLoading, members, messages } = this.props;

    if (isLoading) return <Spinner />;

    const messagesContainer = _.chain(messages)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(order => ({ ...order, date: moment(order.timestamp).format('MMM Do') }))
      .groupBy('date')
      .map((group, date) => {
        const msgs = group.map((msg, index) => {
          const sender = members.find(member => member.id === msg.senderUserID);
          const senderName = sender ? sender.name : 'NO-NAME';
          const isNewSender =
            index === 0 ? true : !(group[index - 1].senderUserID === msg.senderUserID);
          return (
            <Message
              key={msg.id}
              content={msg.content}
              downloadURL={msg.downloadURL}
              isAttachment={msg.isAttachment}
              isNewSender={isNewSender}
              senderName={senderName}
              timestamp={msg.timestamp}
              type={msg.type}
            />
          );
        });
        return (
          <div key={date}>
            <Fonts.P centered>
              <strong>{date}</strong>
            </Fonts.P>
            <Content.Spacing16px />
            {msgs}
            <Content.Spacing16px />
          </div>
        );
      })
      .value();

    return (
      <MessagesContainer>
        <Scrollable alignBottom>
          {messagesContainer}
          <div
            style={{ float: 'left', clear: 'both' }}
            ref={el => {
              this.messagesEnd = el;
            }}
          />
        </Scrollable>
      </MessagesContainer>
    );
  }
}

Messages.propTypes = propTypes;
Messages.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Messages);
