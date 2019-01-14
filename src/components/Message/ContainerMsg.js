import styled from 'styled-components';

import Colors from '../../utils/Colors';

const ContainerMsg = styled.div`
  display: flex;

  :hover {
    background-color: ${Colors.greys.light};
  }
`;

const Buttons = styled.div`
  display: none;
  color: ${Colors.greys.supporting};

  ${ContainerMsg}:hover & {
    display: flex;
    align-items: center;
    margin-right: 16px;
  }
`;

const Reply = styled.div`
  padding-top: 8px;
  padding-bottom: 8px;
  background-color: ${Colors.greys.light};
  width: 100%;
`;

const Wrapper = styled.div``;

ContainerMsg.Buttons = Buttons;
ContainerMsg.Reply = Reply;
ContainerMsg.Wrapper = Wrapper;

export default ContainerMsg;
