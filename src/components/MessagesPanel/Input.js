import styled from 'styled-components';

import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';

const Input = styled.textarea`
  padding: 0;
  border: none;
  font-size: 14px;
  font-family: ${Fonts.family.body};
  color: white;
  background-color: transparent;

  // width: 100%;
  height: 44px;
  overflow-y: auto;
  resize: none;

  ::placeholder {
    opacity: 0.8;
  }

  :focus {
    border: none;
    outline: none;
  }
`;

export default Input;
