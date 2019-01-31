import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';

import Btn from './Btn';
import Media from '../utils/Media';

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  background-color: black;
  opacity: 0.2;
  // z-index: 1;
  overflow-y: auto;
`;

// const BackgroundLight = styled(Background)`
//   background-color: white;
//   opacity: 0.95;
//   opacity: 1;
// `;

const Card = styled.div`
  position: fixed;
  top: 20px;
  // left: 20px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 632px;
  min-height: 95%;
  background-color: white;
  opacity: 1;
  border-radius: 5px;
  padding-left: 40px;
  padding-right: 40px;

  ${Media.tablet} {
    width: 95%;
    margin: 0;
  }
`;

// const CardTransparent = styled(Card)`
//   background-color: transparent;
//   display: flex;
//   flex-direction: column;
//   ${Media.tablet} {
//     width: 90%;
//     margin: 0;
//   }
// `;

const Emoji = styled.div`
  font-size: 96px;
  align-self: center;
`;

const propTypes = {
  handleClose: PropTypes.func,
};

const defaultProps = {
  handleClose: null,
};

const BtnClose = ({ handleClose }) => {
  return (
    <Btn.Tertiary primary onClick={handleClose} style={{ alignSelf: 'flex-start' }}>
      <FaTimes /> Close
    </Btn.Tertiary>
  );
};

BtnClose.propTypes = propTypes;
BtnClose.defaultProps = defaultProps;

const Popup = {};
Popup.Background = Background;
// Popup.BackgroundLight = BackgroundLight;
Popup.Card = Card;
// Popup.CardTransparent = CardTransparent;
Popup.BtnClose = BtnClose;
Popup.Emoji = Emoji;

export default Popup;
