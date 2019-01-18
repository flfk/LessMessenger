import styled from 'styled-components';

import Colors from '../../utils/Colors';

const Btn = styled.button`
  color: white;
  opacity: 0.54;
  background-color: transparent;
  border: none;
  font-size: 16px;

  :focus {
    outline: none;
  }

  :hover {
    opacity: 0.8;
  }
`;

export default Btn;
