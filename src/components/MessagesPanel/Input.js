import styled from 'styled-components';

import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';

const Input = styled.textarea`
  padding: 0;
  padding-left: 56px;
  padding-right: 56px;
  border: none;
  font-size: 16px;
  font-family: ${Fonts.family.body};
  color: ${Colors.greys.primary};

  // width: 100%;
  height: 80px;
  overflow-y: auto;
  resize: none;

  ::placeholder {
    color: ${Colors.greys.supporting};
  }

  :focus {
    border: none;
    outline: none;
  }
`;

export default Input;
