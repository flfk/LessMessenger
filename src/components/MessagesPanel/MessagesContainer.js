import styled from 'styled-components';

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: flex-end;

  height: 500px;

  > div:first-child {
    margin-top: auto !important;
  }
`;

export default MessagesContainer;
