// import mixpanel from 'mixpanel-browser';
import axios from 'axios';
import Emojify from 'react-emojione';
import React from 'react';
import { connect } from 'react-redux';
import { FaFileDownload, FaEdit, FaReply } from 'react-icons/fa';
import { TiPinOutline, TiPin } from 'react-icons/ti';
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
  hasHeader: PropTypes.bool.isRequired,
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

    const spacing = hasHeader ? <Content.Spacing /> : <Content.Spacing8px />;

    const replyPreview = msgBeingRepliedTo ? (
      <Text.Reply
        hasProfileImg={hasHeader}
      >{`${senderBeingRepliedTo}: ${msgBeingRepliedTo}`}</Text.Reply>
    ) : null;

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
          <ContainerMsg.Buttons>
            <button onClick={() => console.log('pinning')} type="button">
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
