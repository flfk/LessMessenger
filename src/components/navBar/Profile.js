import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Colors from '../../utils/Colors';

const Profile = styled.div`
  min-width: 140px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const propTypes = {
  src: PropTypes.string.isRequired,
};

const defaultProps = {};

const ImgDiv = styled.div`
  height: 40px;
  width: 40px;
  flex-shrink: 0;
  background-image: url(${props => props.src});
  background-size: cover;
  border-radius: 20px;
`;

const ProfileImg = ({ src }) => <ImgDiv src={src} />;

ProfileImg.propTypes = propTypes;
ProfileImg.defaultProps = defaultProps;

const ImgWrapper = styled.div`
  display: flex;
  height: 40px;
  width: 40px;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 4px;
`;

const Presence = styled.div`
  height: 15px;
  width: 15px;
  border-radius: 8px;
  background-color: ${props => (props.isOnline ? 'green' : 'red')};
  margin-top: -16px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

Profile.Img = ProfileImg;
Profile.ImgWrapper = ImgWrapper;
Profile.Presence = Presence;
Profile.TextWrapper = TextWrapper;

export default Profile;
