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

  ::placeholder {
    opacity: 0.54;
  }

  :focus {
    outline: none;
  }
`;

const Wrapper = styled.div`
  padding: 1em;
  margin: ${props => (props.isEdit ? '8px 0' : '0px 56px 16px 56px')};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 2px solid ${Colors.greys.tertiary};
  border-radius: 10px;
  max-width: 732px;

  :focus-within {
    border-color: ${Colors.primary.blue};
  }
`;

Input.Wrapper = Wrapper;

export default Input;
