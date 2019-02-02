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
      <Content.Spacing />
      <Content.Spacing />
      <Content.Row justifyCenter>
        <Lottie options={defaultOptions} height={48} width={48} />
      </Content.Row>
      <Content.Spacing />
      <Content.Spacing />
    </div>
  );
};

export default Spinner;
