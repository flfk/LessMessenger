import styled from 'styled-components';

import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';

const Attachment = styled(Fonts.A)`
  color: ${Colors.greys.secondary};
  border: 1px solid ${Colors.greys.tertiary};
  border-radius: 5px;
  padding: 0.5em;
`;

const Message = styled(Fonts.P)`
  word-wrap: break-word
  white-space: pre-line;
  font-size: 14px;
  line-height: 1.5em;
  // line-height: ${props => (props.hasAttachment ? '2.5em' : '2em')};
`;

// Can delete later
const Header = styled(Message)`
  line-height: 1em;
`;

const Tag = styled(Fonts.A)`
  // color: ${props => (props.isSelected ? Colors.primary.red : Colors.greys.supporting)};
  color: white;
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
  white-space- nowrap;
  text-overflow: ellipsis;
`;

const Wrapper = styled.div`
  margin-left: 16px;
  margin-right: 16px;
  ${props => (!props.hasProfileImg && !props.wasSentByUser ? 'margin-left: 48px;' : '')}
  ${props =>
    !props.hasProfileImg && props.wasSentByUser
      ? 'margin-right: 48px;'
      : ''}
  // max-width: calc(100% - 120px);
  max-width: 600px;
  // flex-grow: 1;
  background-color: ${Colors.background.tertiary};
  border-radius: 5px;
  padding: 8px 16px;
`;

const Text = {};
Text.Attachment = Attachment;
Text.Message = Message;
Text.Header = Header;
Text.Tag = Tag;
Text.Timestamp = Timestamp;
Text.Reply = Reply;
Text.Wrapper = Wrapper;

export default Text;
