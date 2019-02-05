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
  margin: 8px 0px;
  padding: 4px 16px;
  background-color: white;
  border-left: 3px solid ${Colors.primary.green};
  border-radius: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const ReplyWrapper = styled.div`
  display: flex;
`;

const Wrapper = styled.div`
  min-height: 21px;
  margin-left: 16px;
  margin-right: 16px;
  ${props => (!props.hasProfileImg && !props.wasSentByUser ? 'margin-left: 48px;' : '')}
  ${props =>
    !props.hasProfileImg && props.wasSentByUser ? 'margin-right: 48px;' : ''}
  padding: 8px 16px;
  max-width: 600px;
  background-color: ${props =>
    props.wasSentByUser ? Colors.primary.blue : Colors.background.primary};
  border: ${props => (props.isSaved ? `2px solid ${Colors.primary.green}` : `2px solid white`)};
  border-radius: 5px;

  display: flex;
  flex-direction: column;
`;

const Text = {};
Text.Attachment = Attachment;
Text.Message = Message;
Text.Tag = Tag;
Text.Timestamp = Timestamp;
Text.Reply = Reply;
Text.ReplyWrapper = ReplyWrapper;
Text.Wrapper = Wrapper;

export default Text;
