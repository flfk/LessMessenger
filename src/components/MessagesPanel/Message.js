import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment-timezone';

import axios from 'axios';

import Btn from '../Btn';
import Content from '../Content';
import Fonts from '../../utils/Fonts';

import { storage } from '../../data/firebase';

const propTypes = {
  content: PropTypes.string.isRequired,
  downloadURL: PropTypes.string,
  isAttachment: PropTypes.bool,
  isNewSender: PropTypes.bool.isRequired,
  timestamp: PropTypes.number.isRequired,
  type: PropTypes.string,
};

const defaultProps = {
  downloadURL: '',
  isAttachment: false,
  type: '',
};

const Message = ({
  content,
  downloadURL,
  isAttachment,
  isNewSender,
  senderName,
  timestamp,
  type,
}) => {
  const header = isNewSender ? (
    <div>
      <Content.Spacing16px />
      <Fonts.P>
        <strong> {senderName} </strong>
        {moment(timestamp).format('h:mm a')}
      </Fonts.P>
    </div>
  ) : null;

  const handleDownload = () => {
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

  const text = isAttachment ? (
    <MessageText>
      <Btn.Tertiary onClick={handleDownload}>{content}</Btn.Tertiary>
    </MessageText>
  ) : (
    <MessageText>{content}</MessageText>
  );

  return (
    <div>
      {header}
      {text}
    </div>
  );
};

const MessageText = styled(Fonts.P)`
  word-wrap: break-word
  white-space: pre-line;
  line-height: 1.5em;
`;

Message.propTypes = propTypes;
Message.defaultProps = defaultProps;

export default Message;
