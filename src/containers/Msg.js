// import mixpanel from 'mixpanel-browser';
import axios from 'axios';
import Emojify from 'react-emojione';
import React from 'react';
import { connect } from 'react-redux';
import { FaFileDownload, FaEdit, FaReply } from 'react-icons/fa';
import { TiPinOutline, TiPin } from 'react-icons/ti';
import Linkify from 'react-linkify';
import reactStringReplace from 'react-string-replace';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import Colors from '../utils/Colors';
import Content from '../components/Content';
import { REGEX_TAG, REGEX_TIMER } from '../utils/Constants';
import Fonts from '../utils/Fonts';
import {
  Btn,
  ContainerMsg,
  Countdown,
  DownloadIcon,
  ImgPreview,
  ProfileImg,
  Text,
} from '../components/message';
import { Input } from '../components/messagesPanel';
import { editMsg, replyToMsg } from '../data/messages/messages.actions';

import { getSelectorAll } from '../utils/Helpers';

const propTypes = {
  actionReplyToMsg: PropTypes.func.isRequired,
  actionEditMsg: PropTypes.func.isRequired,
  hasHeader: PropTypes.bool.isRequired,
  handleTogglePin: PropTypes.func.isRequired,
  msgBeingRepliedTo: PropTypes.string,
  senderBeingRepliedTo: PropTypes.string,
  profileImgURL: PropTypes.string.isRequired,
  selectTag: PropTypes.func.isRequired,
  senderName: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

const defaultProps = {
  msgBeingRepliedTo: '',
  senderBeingRepliedTo: '',
};

const mapStateToProps = state => ({
  tags: getSelectorAll('tags', state),
  userId: state.user.id,
});

const mapDispatchToProps = dispatch => ({
  actionReplyToMsg: msgId => dispatch(replyToMsg(msgId)),
  actionEditMsg: (msg, tags) => dispatch(editMsg(msg, tags)),
});

class Msg extends React.Component {
  state = {
    editInput: '',
    isBeingEdited: false,
  };

  getAttachmentElement = () => {
    const { msg } = this.props;
    const isImg = msg.type.indexOf('image/') > -1;
    if (isImg) {
      return (
        <a href={msg.downloadURL} target="_blank">
          <ImgPreview src={msg.downloadURL} />
        </a>
      );
    }
    return (
      <Text.Attachment onClick={this.handleDownload}>
        <DownloadIcon>
          <FaFileDownload />
        </DownloadIcon>{' '}
        {msg.fileName}
      </Text.Attachment>
    );
  };

  getTag = word => {
    const { msg, selectTag, tags } = this.props;
    const tag = tags.find(item => item.name === word.toLowerCase());
    if (!tag) return `${word} `;
    const wordTagged = reactStringReplace(word, REGEX_TAG, match => (
      <Text.Tag key={tag.id} color={tag.color} isSelected={false} onClick={selectTag(tag.id)}>
        {match}{' '}
      </Text.Tag>
    ));
    return wordTagged;
  };

  getTimer = word => {
    const { msg } = this.props;
    const regExTime = /\d+:\d+:\d+/gi;
    const input = word.match(regExTime)[0].split(':');
    const momentTo = moment(msg.timestamp)
      .add({ days: input[0], hours: input[1], minutes: input[2] })
      .valueOf();
    return <Countdown key={`${msg.timestamp}_${word}`} date={momentTo} />;
  };

  getTextWithTags = text => {
    const { msg } = this.props;
    const words = text.split(' ').map(word => {
      if (msg.hasTimer) {
        const isTimer = word.match(REGEX_TIMER) !== null;
        if (isTimer) return this.getTimer(word);
      }
      if (msg.tagIds && msg.tagIds.length > 0) return this.getTag(word);
      return `${word} `;
    });

    return (
      <Linkify properties={{ target: '_blank', style: { color: Colors.primary.blue } }}>
        <Emojify style={{ height: 16, width: 16 }}>{words}</Emojify>
      </Linkify>
    );
  };

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

  handleEdit = () => {
    console.log('handling Edit in Msg');
    const { msg } = this.props;
    this.setState({ isBeingEdited: true, editInput: msg.content });
  };

  handleEditCancel = () => this.setState({ isBeingEdited: false });

  handleEditSave = () => {
    const { editInput } = this.state;
    const { actionEditMsg, msg, tags } = this.props;
    actionEditMsg({ ...msg, content: editInput }, tags);
    this.handleEditCancel();
  };

  handleDownload = () => {
    const { msg } = this.props;
    axios({
      url: msg.downloadURL,
      method: 'GET',
      responseType: 'blob', // important
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', msg.fileName);
      document.body.appendChild(link);
      link.click();
    });
  };

  render() {
    const { editInput, isBeingEdited } = this.state;

    const {
      actionReplyToMsg,
      hasHeader,
      handleTogglePin,
      msg,
      msgBeingRepliedTo,
      senderBeingRepliedTo,
      profileImgURL,
      senderName,
      userId,
    } = this.props;

    const profileImg = hasHeader ? <ProfileImg src={profileImgURL} /> : null;

    const header = hasHeader ? (
      <Fonts.Label isSupporting>
        <strong>{senderName}</strong>{' '}
        <Text.Timestamp>{moment(msg.timestamp).format('h:mm a')}</Text.Timestamp>
      </Fonts.Label>
    ) : null;

    let text = msg.hasAttachment ? (
      <div>
        {this.getAttachmentElement()}
        <br />
        <Text.Message hasAttachment>{this.getTextWithTags(msg.content)}</Text.Message>
      </div>
    ) : (
      <Text.Message>{this.getTextWithTags(msg.content)}</Text.Message>
    );

    if (isBeingEdited) {
      text = (
        <div>
          <Input
            type="text"
            placeholder="Type a message..."
            onChange={this.handleChangeInput('editInput')}
            value={editInput}
          />
          <div>
            <button type="button" onClick={this.handleEditSave}>
              Save
            </button>
            <button type="button" onClick={this.handleEditCancel}>
              Cancel
            </button>
          </div>
        </div>
      );
    }

    const spacing = hasHeader && !msg.isPinned ? <Content.Spacing /> : <Content.Spacing8px />;

    const replyPreview = msgBeingRepliedTo ? (
      <ContainerMsg.Reply>
        <Text.Reply>{`${senderBeingRepliedTo}: ${msgBeingRepliedTo}`}</Text.Reply>
      </ContainerMsg.Reply>
    ) : null;
    return (
      <ContainerMsg.Wrapper>
        {spacing}
        <ContainerMsg wasSentByUser={msg.senderUserId === userId}>
          {profileImg}
          <Text.Wrapper hasProfileImg={hasHeader} wasSentByUser={msg.senderUserId === userId}>
            {header}
            {replyPreview}
            {text}
          </Text.Wrapper>
          <ContainerMsg.Buttons wasSentByUser={msg.senderUserId === userId}>
            <Btn onClick={() => handleTogglePin(msg.id)}>
              <TiPin />
            </Btn>
            <Btn onClick={this.handleEdit}>
              <FaEdit />
            </Btn>
            <Btn onClick={() => actionReplyToMsg(msg.id)}>
              <FaReply />
            </Btn>
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
