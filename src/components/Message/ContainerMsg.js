import styled from 'styled-components';

import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';

const ContainerMsg = styled.div`
  padding: 0px 16px 0px 16px;
  margin-top: ${props => (props.hasHeader ? '8px' : '4px')};
  display: flex;
  flex-direction: ${props => (props.wasSentByUser ? 'row-reverse' : 'row')}
  flex-direction: ${props => (props.wasSentByUser ? 'row-reverse' : 'row')}
  align-items: center;
  justify-content: flex-start;
`;

const Buttons = styled.div`
  display: none;
  color: black;
  height: 16px;

  ${ContainerMsg}:hover & {
    display: flex;
    flex-direction: ${props => (props.wasSentByUser ? 'row-reverse' : 'row')}
    align-items: center;
  }
`;

const Reply = styled.div`
  // margin: 4px 0;
  // padding: 4px 16px;
  // background-color: ${Colors.greys.quaternary}
  // opacity: 0.4;
  // border-radius: 5px;
`;

const Wrapper = styled.div`
  width: 100%;
`;

ContainerMsg.Buttons = Buttons;
ContainerMsg.Reply = Reply;
ContainerMsg.Wrapper = Wrapper;

export default ContainerMsg;
