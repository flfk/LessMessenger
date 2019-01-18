import styled from 'styled-components';

import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';

const ContainerMsg = styled.div`
  padding: 4px 0px 4px 16px;

  display: flex;
  flex-direction: ${props => (props.wasSentByUser ? 'row-reverse' : 'row')}
  align-items: center;
  justify-content: flex-start;
  :hover {
    // background-color: ${Colors.background.tertiary};
  }
  ${props => (props.isPinned ? 'max-height: 42px;' : '')}
  ${props => (props.isPinned ? 'white-space: nowrap;' : '')}
  ${props => (props.isPinned ? 'overflow: hidden;' : '')}
  ${props => (props.isPinned ? 'text-overflow: ellipsis;' : '')}
`;

const Buttons = styled.div`
  display: none;
  color: ${Colors.greys.tertiary};
  height: 16px;

  ${ContainerMsg}:hover & {
    display: flex;
    flex-direction: ${props => (props.wasSentByUser ? 'row-reverse' : 'row')}
    align-items: center;
  }
`;

const Reply = styled.div`
  margin: 4px 0;
  padding: 4px 16px;
  background-color: ${Colors.background.secondary};
  opacity: ${Fonts.opacity.primary};
  border-radius: 5px;
`;

const Wrapper = styled.div`
  width: 100%;
`;

ContainerMsg.Buttons = Buttons;
ContainerMsg.Reply = Reply;
ContainerMsg.Wrapper = Wrapper;

export default ContainerMsg;
