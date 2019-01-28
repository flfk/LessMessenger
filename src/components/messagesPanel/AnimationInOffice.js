import React from 'react';
import styled from 'styled-components';
import Lottie from 'react-lottie';

import animationData from '../../assets/typing.json';

const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

const AnimationInOffice = props => {
  return (
    <Wrapper>
      <Lottie options={defaultOptions} height={48} width={48} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  // overflow: visible;
  margin-top: -40px;
`;

export default AnimationInOffice;
