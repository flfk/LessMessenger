import styled from 'styled-components';

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;

  // overflow: hidden;

  // :hover {
  //   overflow: auto;
  // }

  > div:first-child {
    margin-top: auto !important;
  }
`;

export default MessagesContainer;
