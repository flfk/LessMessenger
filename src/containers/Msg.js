// import mixpanel from 'mixpanel-browser';
import axios from 'axios';
import Emojify from 'react-emojione';
import React from 'react';
import { connect } from 'react-redux';
import { FaFileDownload, FaEdit, FaReply } from 'react-icons/fa';
import { TiPinOutline } from 'react-icons/ti';
import Linkify from 'react-linkify';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import Colors from '../utils/Colors';
import Content from '../components/Content';
import { REGEX_TIMER } from '../utils/Constants';
import Countdown from '../components/Countdown';
import { ContainerMsg, DownloadIcon, ProfileImg, Text } from '../components/message';
import { togglePinMsg, replyToMsg } from '../data/messages/messages.actions';

const propTypes = {
  actionTogglePin: PropTypes.func.isRequired,
  actionReplyToMsg: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
  downloadURL: PropTypes.string,
  id: PropTypes.string.isRequired,
  isPinned: PropTypes.bool,
  isAttachment: PropTypes.bool,
  hasHeader: PropTypes.bool.isRequired,
  hasTimer: PropTypes.bool,
  msgBeingRepliedTo: PropTypes.string,
  senderBeingRepliedTo: PropTypes.string,
  profileImgURL: PropTypes.string.isRequired,
  selectTag: PropTypes.func.isRequired,
  senderName: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  type: PropTypes.string,
};

const defaultProps = {
  downloadURL: '',
  hasTimer: false,
  isAttachment: false,
  isPinned: false,
  msgBeingRepliedTo: '',
  senderBeingRepliedTo: '',
  type: '',
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  actionTogglePin: (id, isPinned) => dispatch(togglePinMsg(id, isPinned)),
  actionReplyToMsg: msgId => dispatch(replyToMsg(msgId)),
});

class Msg extends React.Component {
  state = {};

  getTimer = command => {
    // note input for timer must be +timer(days:hrs:mins);
    const { timestamp } = this.props;
    const regExTime = /\d+:\d+:\d+/gi;
    const input = command.match(regExTime)[0].split(':');
    const inputDays = input[0];
    const inputHrs = input[1];
    const inputMins = input[2];

    const momentTo = moment(timestamp)
      .add({ days: inputDays, hours: inputHrs, minutes: inputMins })
      .valueOf();

    return <Countdown key={`${timestamp}_${command}`} date={momentTo} />;
  };

  getTextWithTags = text => {
    const { hasTimer, timestamp, selectTag } = this.props;
    const words = text.split(' ').map((word, index) => {
      if (hasTimer) {
        const isTimer = word.match(REGEX_TIMER) !== null;
        if (isTimer) return this.getTimer(word);
      }
      if (word[0] !== '#') return (word += ' ');
      return (
        <Text.Tag key={`${timestamp}${index}`} isSelected={false} onClick={selectTag(word)}>
          {word}{' '}
        </Text.Tag>
      );
    });

    return (
      <Linkify properties={{ target: '_blank', style: { color: Colors.primary.blue } }}>
        <Emojify style={{ height: 16, width: 16 }}>{words}</Emojify>
      </Linkify>
    );
  };

  handleDownload = () => {
    const { content, downloadURL } = this.props;
    axios({
      url: downloadURL,
      method: 'GET',
      responseType: 'blob', // important
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', content);
      document.body.appendChild(link);
      link.click();
    });
  };

  handlePin = () => {
    console.log('handling pin called');
    const { actionTogglePin, id, isPinned } = this.props;
    console.log('toggling pin for', id, isPinned);
    actionTogglePin(id, isPinned);
  };

  render() {
    const {
      actionReplyToMsg,
      content,
      id,
      isAttachment,
      isPinned,
      hasHeader,
      msgBeingRepliedTo,
      senderBeingRepliedTo,
      profileImgURL,
      senderName,
      timestamp,
      type,
    } = this.props;

    const profileImg = hasHeader ? <ProfileImg src={profileImgURL} /> : null;

    const header = hasHeader ? (
      <Text.Header hasProfileImg={hasHeader}>
        {senderName} <Text.Timestamp>{moment(timestamp).format('h:mm a')}</Text.Timestamp>
      </Text.Header>
    ) : null;

    const text = isAttachment ? (
      <Text.Message hasProfileImg={hasHeader} hasAttachment>
        <Text.Attachment onClick={this.handleDownload}>
          <DownloadIcon>
            <FaFileDownload />
          </DownloadIcon>{' '}
          {content}
        </Text.Attachment>
      </Text.Message>
    ) : (
      <Text.Message hasProfileImg={hasHeader}>{this.getTextWithTags(content)}</Text.Message>
    );

    const spacing = hasHeader && !isPinned ? <Content.Spacing /> : <Content.Spacing8px />;

    const replyPreview = msgBeingRepliedTo ? (
      <Text.Reply
        hasProfileImg={hasHeader}
      >{`${senderBeingRepliedTo}: ${msgBeingRepliedTo}`}</Text.Reply>
    ) : null;

    return (
      <ContainerMsg.Wrapper>
        {spacing}
        <ContainerMsg isPinned={isPinned}>
          {profileImg}
          <Text.Wrapper>
            {header}
            {replyPreview}
            {text}
          </Text.Wrapper>
          <ContainerMsg.Buttons>
            <button onClick={this.handlePin} type="button">
              <TiPinOutline />
            </button>
            <button onClick={() => console.log('edit')} type="button">
              <FaEdit />
            </button>
            <button onClick={() => actionReplyToMsg(id)} type="button">
              <FaReply />
            </button>
          </ContainerMsg.Buttons>
        </ContainerMsg>
      </ContainerMsg.Wrapper>
    );
  }
}

Msg.propTypes = propTypes;
Msg.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Msg);