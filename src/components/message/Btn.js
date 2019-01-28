import styled from 'styled-components';

import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';

const Btn = styled.button`
  color: ${Colors.greys.primary};
  opacity: ${Fonts.opacity.tertiary};
  background-color: transparent;
  border: none;
  font-size: 14px;

  :focus {
    outline: none;
  }

  :hover {
    opacity: ${Fonts.opacity.secondary};
  }
`;

export default Btn;
