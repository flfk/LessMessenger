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
  flex-basis: 40px;
  flex-shrink: 0;
  background-image: url(${props => props.src});
  background-size: cover;
  border-radius: 20px;

  margin-right: 4px;
`;

const ProfileImg = ({ src }) => <ImgDiv src={src} />;

ProfileImg.propTypes = propTypes;
ProfileImg.defaultProps = defaultProps;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

Profile.Img = ProfileImg;
Profile.TextWrapper = TextWrapper;

export default Profile;
