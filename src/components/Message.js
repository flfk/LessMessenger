import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment-timezone';

import Content from './Content';
import Fonts from '../utils/Fonts';

const propTypes = {};

const defaultProps = {};

const Message = ({ content, senderName, timestamp }) => {
  return (
    <div>
      <Fonts.P>
        <strong> {senderName} </strong>
        {moment(timestamp).format('h:mm a')}
      </Fonts.P>
      <Fonts.P>{content}</Fonts.P>
      <Content.Spacing16px />
    </div>
  );
};

Message.propTypes = propTypes;
Message.defaultProps = defaultProps;

export default Message;
