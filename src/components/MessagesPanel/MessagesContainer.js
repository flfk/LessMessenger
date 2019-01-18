import styled from 'styled-components';

import Colors from '../../utils/Colors';

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  background-color: ${Colors.background.primary};

  > div:first-child {
    margin-top: auto !important;
  }
`;

export default MessagesContainer;
