import styled from 'styled-components';

import Colors from '../../utils/Colors';

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: flex-start;
  height: 500px;
  padding-left: 16px;

  background-color: ${Colors.background.primary};
  border: 1px solid red;

  > div:first-child {
    margin-top: auto !important;
  }
`;

export default MessagesContainer;
