import axios from 'axios';
import Emojify from 'react-emojione';
import React from 'react';
import { connect } from 'react-redux';
import { FaFileDownload, FaEdit, FaRegSave, FaReply, FaTrashAlt } from 'react-icons/fa';
import Linkify from 'react-linkify';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import Fonts from '../utils/Fonts';
import {
  Btn,
  ContainerMsg,
  DownloadIcon,
  ImgPreview,
  ProfileImg,
  Text,
} from '../components/message';
import { Input } from '../components/messagesPanel';
import { deleteMsg, editMsg, replyToMsg, toggleSaveMsg } from '../data/messages/messages.actions';

const propTypes = {
  actionDeleteMsg: PropTypes.func.isRequired,
  actionEditMsg: PropTypes.func.isRequired,
  actionToggleSave: PropTypes.func.isRequired,
  actionReplyToMsg: PropTypes.func.isRequired,
  hasHeader: PropTypes.bool.isRequired,
  msgBeingRepliedTo: PropTypes.string,
  senderBeingRepliedTo: PropTypes.string,
  profileImgURL: PropTypes.string.isRequired,
  senderName: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

const defaultProps = {
  msgBeingRepliedTo: '',
  senderBeingRepliedTo: '',
};

const mapStateToProps = state => ({
  userId: state.user.id,
});

const mapDispatchToProps = dispatch => ({
  actionDeleteMsg: id => dispatch(deleteMsg(id)),
  actionEditMsg: msg => dispatch(editMsg(msg)),
  actionReplyToMsg: id => dispatch(replyToMsg(id)),
  actionToggleSave: (msg, userId) => dispatch(toggleSaveMsg(msg, userId)),
});

class Msg extends React.Component {
  state = {
    editInput: '',
    isBeingEdited: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    // limit rerenders to editing only to improve performance
    if (this.props.msg.content !== nextProps.msg.content) return true;
    if (this.state.isBeingEdited !== nextState.isBeingEdited) return true;
    if (this.state.editInput !== nextState.editInput) return true;
    return true;
  }

  getAttachmentElement = () => {
    const { msg } = this.props;
    const isImg = msg.type.indexOf('image/') > -1;
    if (isImg) {
      return (
        <a href={msg.downloadURL} target="_blank" rel="noopener noreferrer">
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

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

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

  handleEdit = () => {
    const { msg } = this.props;
    this.setState({ isBeingEdited: true, editInput: msg.content });
  };

  handleEditCancel = () => this.setState({ isBeingEdited: false });

  handleEditSave = () => {
    const { editInput } = this.state;
    const { actionEditMsg, msg } = this.props;
    actionEditMsg({ ...msg, content: editInput });
    this.handleEditCancel();
  };

  render() {
    const { editInput, isBeingEdited } = this.state;

    const {
      actionDeleteMsg,
      actionReplyToMsg,
      actionToggleSave,
      hasHeader,
      msg,
      msgBeingRepliedTo,
      senderBeingRepliedTo,
      profileImgURL,
      senderName,
      userId,
    } = this.props;

    const profileImg = hasHeader ? <ProfileImg src={profileImgURL} /> : null;

    const header = hasHeader ? (
      <Fonts.Label isTertiary>
        <strong>{senderName}</strong>{' '}
        <Text.Timestamp>{moment(msg.timestamp).format('h:mm a')}</Text.Timestamp>
      </Fonts.Label>
    ) : null;

    const attachment = msg.hasAttachment ? this.getAttachmentElement() : null;

    let text = (
      <Text.Message>
        <Linkify properties={{ target: '_blank', style: { color: 'black', opacity: '0.8' } }}>
          <Emojify style={{ height: 16, width: 16 }}>{msg.content}</Emojify>
        </Linkify>
      </Text.Message>
    );

    if (isBeingEdited) {
      text = (
        <div>
          <Input.Wrapper isEdit>
            <Input
              type="text"
              placeholder="Type a message..."
              onChange={this.handleChangeInput('editInput')}
              value={editInput}
            />
          </Input.Wrapper>
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

    const replyPreview = msgBeingRepliedTo ? (
      <Text.Reply>{`${senderBeingRepliedTo}: ${msgBeingRepliedTo}`}</Text.Reply>
    ) : null;

    const isSaved = msg.savesByUserId && msg.savesByUserId.length > 0;

    return (
      <ContainerMsg.Wrapper>
        <ContainerMsg hasHeader={hasHeader} wasSentByUser={msg.senderUserId === userId}>
          {profileImg}
          <Text.Wrapper
            hasProfileImg={hasHeader}
            isSaved={isSaved}
            wasSentByUser={msg.senderUserId === userId}
          >
            {header}
            {replyPreview}
            {attachment}
            {text}
          </Text.Wrapper>
          <ContainerMsg.Buttons wasSentByUser={msg.senderUserId === userId}>
            <Btn onClick={() => actionReplyToMsg(msg.id)}>
              <FaReply />
            </Btn>
            <Btn>
              <FaTrashAlt onClick={() => actionDeleteMsg(msg.id)} />
            </Btn>
            <Btn onClick={this.handleEdit}>
              <FaEdit />
            </Btn>
            <Btn onClick={() => actionToggleSave(msg, userId)}>
              <FaRegSave />
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
