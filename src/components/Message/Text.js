import styled from 'styled-components';

import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';

const Attachment = styled(Fonts.A)`
  color: ${Colors.greys.secondary};
  border: 1px solid ${Colors.greys.tertiary};
  border-radius: 5px;
  padding: 0.5em;
  margin: 4px 0px;
`;

const Message = styled(Fonts.P)`
  word-wrap: break-word
  white-space: pre-line;
  font-size: 14px;
  line-height: 1.5em;
  // line-height: ${props => (props.hasAttachment ? '2.5em' : '2em')};
`;

const Tag = styled(Fonts.A)`
  color: ${props => (props.color ? props.color : 'black')};
  opacity: ${Fonts.opacity.primary};
`;

const Timestamp = styled.span`
  color: ${Colors.greys.tertiary};
  font-weight: 400;
`;

const Reply = styled(Message)`
  color: white;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Wrapper = styled.div`
  margin-left: 16px;
  margin-right: 16px;
  ${props => (!props.hasProfileImg && !props.wasSentByUser ? 'margin-left: 48px;' : '')}
  ${props =>
    !props.hasProfileImg && props.wasSentByUser ? 'margin-right: 48px;' : ''}
  max-width: 600px;
  background-color: ${props =>
    props.wasSentByUser ? Colors.primary.blue : Colors.background.primary};
  border: 1px solid ${Colors.greys.quaternary};
  border-radius: 5px;
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  // align-items: flex-start;
`;

const Text = {};
Text.Attachment = Attachment;
Text.Message = Message;
Text.Tag = Tag;
Text.Timestamp = Timestamp;
Text.Reply = Reply;
Text.Wrapper = Wrapper;

export default Text;
