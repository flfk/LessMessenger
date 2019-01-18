import styled from 'styled-components';

import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';

const Attachment = styled(Fonts.A)`
  color: ${Colors.greys.secondary};
  border: 1px solid ${Colors.greys.supporting};
  border-radius: 5px;
  padding: 0.5em;
`;

const Message = styled(Fonts.P)`
  word-wrap: break-word
  white-space: pre-line;
  font-size: 14px;
  line-height: ${props => (props.hasAttachment ? '2.5em' : '2em')};
  margin-left: ${props => (props.hasProfileImg ? '16px' : '56px')};
`;

// Can delete later
const Header = styled(Message)`
  line-height: 1em;
`;

const Tag = styled(Fonts.A)`
  color: ${props => (props.isSelected ? Colors.primary.red : Colors.greys.secondary)};
`;

const Timestamp = styled.span`
  color: ${Colors.greys.supporting};
  font-weight: 400;
`;

const Reply = styled(Message)`
  background-color: ${Colors.background.secondary};
  border-radius: 5px;
  color: white;
  opacity: 0.8;
  max-height: 2em;
  overflow: hidden;
  white-space- nowrap;
  text-overflow: ellipsis;
`;

const Wrapper = styled.div`
  margin-right: auto;
  max-width: calc(100% - 120px);
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
