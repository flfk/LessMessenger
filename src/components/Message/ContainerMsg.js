import styled from 'styled-components';

import Colors from '../../utils/Colors';

const ContainerMsg = styled.div`
  display: flex;
  justify-content: space-between;
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

const Reply = styled.span`
  background-color: ${Colors.greys.light};
  display: block
  width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Wrapper = styled.div``;

ContainerMsg.Buttons = Buttons;
ContainerMsg.Reply = Reply;
ContainerMsg.Wrapper = Wrapper;

export default ContainerMsg;
