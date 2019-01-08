import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Btn from '../components/Btn';
import InputText from '../components/InputText';

const propTypes = {};

const defaultProps = {};

const MessageInput = ({ handleSend, placeholder, onChange, value }) => {
  return (
    <div>
      <InputText.Area placeholder={placeholder} onChange={onChange} value={value} />
      <Btn.Tertiary onClick={handleSend}>Send</Btn.Tertiary>
    </div>
  );
};

MessageInput.propTypes = propTypes;
MessageInput.defaultProps = defaultProps;

export default MessageInput;
