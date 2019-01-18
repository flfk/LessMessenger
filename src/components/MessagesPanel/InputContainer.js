import styled from 'styled-components';

import Colors from '../../utils/Colors';

const InputContainer = styled.div`
  padding: 0 0 16px 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background-color: ${Colors.background.secondary};
  border-top: 1px solid ${Colors.background.supporting};
`;

export default InputContainer;
