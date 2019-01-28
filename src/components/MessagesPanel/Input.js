import Textarea from 'react-textarea-autosize';
import styled from 'styled-components';

import Fonts from '../../utils/Fonts';
import Colors from '../../utils/Colors';

const Input = styled(Textarea)`
  padding: 0;
  border: none;
  font-size: 14px;
  font-family: ${Fonts.family.body};
  opacity: 0.8;
  background-color: transparent;
  min-width: 600px;
  resize: none;

  border: 2px solid ${Colors.greys.tertiary};
  border-radius: 10px;
  padding: 1em;

  ::placeholder {
    opacity: 0.54;
  }

  :focus {
    outline: none;
    border-color: ${Colors.primary.blue};
  }
`;

export default Input;
