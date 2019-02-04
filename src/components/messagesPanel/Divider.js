import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';

const propTypes = {
  text: PropTypes.string.isRequired,
};

const defaultProps = {};

const Wrapper = styled.div`
  border-bottom: 1px solid ${Colors.primary.darkBlue};
  text-align: center;
  margin: 16px;
`;

const Text = styled(Fonts.H3)`
  display: inline;
`;

const Divider = ({ text }) => (
  <Wrapper>
    <Text noMargin>{text}</Text>
  </Wrapper>
);

Divider.propTypes = propTypes;
Divider.defaultProps = defaultProps;

export default Divider;
