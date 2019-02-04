import React from 'react';

import Content from './Content';
import Fonts from '../utils/Fonts';

const ErrorScreen = () => {
  return (
    <Content>
      <Fonts.H2>Oops, something went wrong</Fonts.H2>
      <Fonts.P>
        Please try again. If things still don't work please contact us at TheLessMessenger@gmail.com
      </Fonts.P>
    </Content>
  );
};

export default ErrorScreen;
