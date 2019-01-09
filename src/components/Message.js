import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment-timezone';

import Content from './Content';
import Fonts from '../utils/Fonts';

const propTypes = {};

const defaultProps = {};

const Message = ({ content, isNewSender, senderName, timestamp }) => {
  const header = isNewSender ? (
    <div>
      <Content.Spacing16px />
      <Fonts.P>
        <strong> {senderName} </strong>
        {moment(timestamp).format('h:mm a')}
      </Fonts.P>
    </div>
  ) : null;

  return (
    <div>
      {header}
      <MessageText>{content}</MessageText>
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
