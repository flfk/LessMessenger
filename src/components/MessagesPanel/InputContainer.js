import styled from 'styled-components';

import Colors from '../../utils/Colors';

const InputContainer = styled.div`
  // padding: 0 56px 16px 56px;
  padding: 1em;
  margin: 16px 56px 16px 56px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 2px solid ${Colors.greys.tertiary};
  border-radius: 10px;
`;

export default InputContainer;
