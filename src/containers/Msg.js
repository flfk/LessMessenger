// import mixpanel from 'mixpanel-browser';
import axios from 'axios';
import Emojify from 'react-emojione';
import React from 'react';
import { connect } from 'react-redux';
import { FaFileDownload, FaReply } from 'react-icons/fa';
import Linkify from 'react-linkify';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import Colors from '../utils/Colors';
import Content from '../components/Content';
import { ContainerMsg, DownloadIcon, ProfileImg, Text } from '../components/message';
import { replyToMsg } from '../data/messages/messages.actions';

const propTypes = {
  actionReplyToMsg: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
  downloadURL: PropTypes.string,
  id: PropTypes.string.isRequired,
  isAttachment: PropTypes.bool,
  isNewSender: PropTypes.bool.isRequired,
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
  isAttachment: false,
  msgBeingRepliedTo: '',
  senderBeingRepliedTo: '',
  type: '',
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  actionReplyToMsg: msgID => dispatch(replyToMsg(msgID)),
});

class Msg extends React.Component {
  state = {};

  getTextWithTags = text => {
    const { timestamp, selectTag } = this.props;
    const words = text.split(' ').map((word, index) => {
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

  render() {
    const {
      actionReplyToMsg,
      content,
      id,
      isAttachment,
      isNewSender,
      msgBeingRepliedTo,
      senderBeingRepliedTo,
      profileImgURL,
      senderName,
      timestamp,
      type,
    } = this.props;

    const profileImg = isNewSender ? <ProfileImg src={profileImgURL} /> : null;

    const header = isNewSender ? (
      <Text.Header hasProfileImg={isNewSender}>
        {senderName} <Text.Timestamp>{moment(timestamp).format('h:mm a')}</Text.Timestamp>
      </Text.Header>
    ) : null;

    const text = isAttachment ? (
      <Text.Message hasProfileImg={isNewSender} hasAttachment>
        <Text.Attachment onClick={this.handleDownload}>
          <DownloadIcon>
            <FaFileDownload />
          </DownloadIcon>{' '}
          {content}
        </Text.Attachment>
      </Text.Message>
    ) : (
      <Text.Message hasProfileImg={isNewSender}>{this.getTextWithTags(content)}</Text.Message>
    );

    const spacing = isNewSender ? <Content.Spacing /> : <Content.Spacing8px />;

    const replyPreview = msgBeingRepliedTo ? (
      <ContainerMsg.Reply>
        <Text.Message isReplyPreview>
          {`${senderBeingRepliedTo}: ${msgBeingRepliedTo}`}
        </Text.Message>
      </ContainerMsg.Reply>
    ) : null;

    const replyBtn = (
      <button onClick={() => actionReplyToMsg(id)}>
        <FaReply />
      </button>
    );

    return (
      <ContainerMsg.Wrapper>
        {spacing}
        <ContainerMsg>
          {profileImg}
          <Text.Wrapper>
            {header}
            {replyPreview}
            {text}
          </Text.Wrapper>
          <ContainerMsg.Buttons>{replyBtn}</ContainerMsg.Buttons>
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
