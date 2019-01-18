import styled from 'styled-components';

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  > div:first-child {
    margin-top: auto !important;
  }
`;

export default MessagesContainer;
