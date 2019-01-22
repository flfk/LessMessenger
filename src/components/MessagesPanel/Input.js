import Textarea from 'react-textarea-autosize';
import styled from 'styled-components';

import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';

const Input = styled(Textarea)`
  padding: 0;
  border: none;
  font-size: 14px;
  font-family: ${Fonts.family.body};
  color: white;
  background-color: transparent;
  min-width: 600px;
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
