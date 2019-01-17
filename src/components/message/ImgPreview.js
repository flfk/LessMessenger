import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const propTypes = {
  src: PropTypes.string.isRequired,
};

const defaultProps = {};

const ImgDiv = styled.div`
  margin-left: 56px;
  width: 280px;
  height: 280px;
  background-image: url(${props => props.src});
  background-size: cover;
  border-radius: 10px;
`;

const ImgPreview = ({ src }) => <ImgDiv src={src} />;

ImgPreview.propTypes = propTypes;
ImgPreview.defaultProps = defaultProps;

export default ImgPreview;
