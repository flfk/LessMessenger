import styled from 'styled-components';

import Fonts from '../../utils/Fonts';

const Btn = styled.button`
  color: white;
  opacity: ${Fonts.opacity.secondary};
  background-color: transparent;
  border: none;
  font-size: 14px;

  :focus {
    outline: none;
  }

  :hover {
    opacity: ${Fonts.opacity.primary};
  }
`;

export default Btn;
