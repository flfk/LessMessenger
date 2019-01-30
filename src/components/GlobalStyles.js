import { createGlobalStyle } from 'styled-components';
import HammersmithOne from '../utils/HammersmithOne-Regular.ttf';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: HammersmithOne;
    src: url(${HammersmithOne});
  }
`;

export default GlobalStyle;
