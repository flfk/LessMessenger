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
  margin-right: 56px;

  ${props => (props.isReplyPreview ? 'max-height: 2em;' : '')}
  ${props => (props.isReplyPreview ? 'overflow: hidden;' : '')}
  ${props => (props.isReplyPreview ? 'white-space: nowrap;' : '')}
  ${props => (props.isReplyPreview ? 'text-overflow: ellipsis;' : '')}
`;

const Header = styled(Message)`
  line-height: 1em;
  font-weight: bold;
`;

const Tag = styled(Fonts.A)`
  color: ${props => (props.isSelected ? Colors.primary.red : Colors.greys.secondary)};
`;

const Timestamp = styled.span`
  color: ${Colors.greys.supporting};
  font-weight: 400;
`;

const Wrapper = styled.div`
  margin-right: auto;
`;

const Text = {};
Text.Attachment = Attachment;
Text.Message = Message;
Text.Header = Header;
Text.Tag = Tag;
Text.Timestamp = Timestamp;
Text.Wrapper = Wrapper;

export default Text;
