import styled from 'styled-components';

const MessagesContainer = styled.div`
  // border: 1px solid green;

  display: flex;
  flex-direction: column;
  // flex-basis: 400px;
  overflow: auto;

  > div:first-child {
    margin-top: auto !important;
  }
`;

export default MessagesContainer;
