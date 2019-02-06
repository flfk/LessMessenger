import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';
import { MdCancel } from 'react-icons/md';

import Colors from '../../utils/Colors';

const propTypes = {
  isImage: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

const defaultProps = {
  isImage: false,
};

const Wrapper = styled.button`
  align-self: flex-start;
  justify-self: flex-end;
  border: none;
  padding: 0;
  margin-left: ${props => (props.isImage ? '-40px' : '8px')};
  margin-top: 8px;
  font-size: 14px;
  color: ${Colors.greys.tertiary};
  background-color: transparent;

  :hover {
    color: ${Colors.greys.primary};
  }

  :focus {
    outline: none;
  }
`;

const CancelBtn = ({ isImage, onClick }) => (
  <Wrapper isImage={isImage} onClick={onClick}>
    <MdCancel />
  </Wrapper>
);

CancelBtn.propTypes = propTypes;
CancelBtn.defaultProps = defaultProps;

export default CancelBtn;
