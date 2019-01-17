import styled from 'styled-components';

import Colors from '../../utils/Colors';

const InputContainer = styled.div`
  border: 1px solid blue;
  border-top: 1px solid ${Colors.greys.supporting};
  padding: 0 0 16px 0;
  display: flex;
  flex-direction: column;
  background-color: ${Colors.background.secondary};
`;

export default InputContainer;
