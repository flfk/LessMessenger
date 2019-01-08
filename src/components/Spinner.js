import React from 'react';
import { BounceLoader } from 'react-spinners';

import Content from './Content';
import Colors from '../utils/Colors';

const Spinner = () => {
  return (
    <div>
      <Content.Spacing />
      <Content.Spacing />
      <Content.Row justifyCenter>
        <BounceLoader sizeUnit="px" size={24} color={Colors.primary.red} />
      </Content.Row>
    </div>
  );
};

export default Spinner;
