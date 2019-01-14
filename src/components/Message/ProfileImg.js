import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

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
`;

const ProfileImg = ({ src }) => <ImgDiv src={src} />;

ProfileImg.propTypes = propTypes;
ProfileImg.defaultProps = defaultProps;

export default ProfileImg;
