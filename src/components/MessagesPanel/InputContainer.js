import styled from 'styled-components';

import Colors from '../../utils/Colors';

const InputContainer = styled.div`
  padding: 0 56px 16px 56px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background-color: ${Colors.background.secondary};
  border-top: 1px solid ${Colors.background.tertiary};
`;

export default InputContainer;
