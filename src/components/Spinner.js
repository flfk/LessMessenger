import React from 'react';
import Lottie from 'react-lottie';

import AnimationLoading from '../assets/AnimationLoading';
import Content from './Content';

const Spinner = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: AnimationLoading,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div>
      <Content.Row justifyCenter>
        <Lottie options={defaultOptions} height={40} width={40} />
      </Content.Row>
    </div>
  );
};

export default Spinner;
