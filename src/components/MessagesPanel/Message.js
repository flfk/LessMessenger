import axios from 'axios';
import React from 'react';
import Linkify from 'react-linkify';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment-timezone';

import Btn from '../Btn';
import Content from '../Content';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import ProfileImg from './ProfileImg';

const propTypes = {
  content: PropTypes.string.isRequired,
  downloadURL: PropTypes.string,
  isAttachment: PropTypes.bool,
  isNewSender: PropTypes.bool.isRequired,
  profileImgURL: PropTypes.string.isRequired,
  selectTag: PropTypes.func.isRequired,
  senderName: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  type: PropTypes.string,
};

const defaultProps = {
  downloadURL: '',
  isAttachment: false,
  type: '',
};

const Message = ({
  content,
  downloadURL,
  isAttachment,
  isNewSender,
  profileImgURL,
  selectTag,
  senderName,
  timestamp,
  type,
}) => {
  const getTextWithTags = text => {
    const words = text.split(' ').map((word, index) => {
      if (word[0] !== '#') return (word += ' ');
      return (
        <TagText key={`${timestamp}${index}`} isSelected={false} onClick={selectTag(word)}>
          {word}{' '}
        </TagText>
      );
    });
    return <Linkify properties={{ target: '_blank' }}>{words}</Linkify>;
  };

  const handleDownload = () => {
    axios({
      url: downloadURL,
      method: 'GET',
      responseType: 'blob', // important
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', content);
      document.body.appendChild(link);
      link.click();
    });
  };

  const profileImg = isNewSender ? <ProfileImg src={profileImgURL} /> : null;

  const header = isNewSender ? (
    <MessageText hasProfileImg={isNewSender}>
      <strong> {senderName} </strong>
      <Timestamp>{moment(timestamp).format('h:mm a')}</Timestamp>
    </MessageText>
  ) : null;

  const text = isAttachment ? (
    <MessageText hasProfileImg={isNewSender}>
      <Btn.Tertiary onClick={handleDownload}>{content}</Btn.Tertiary>
    </MessageText>
  ) : (
    <MessageText hasProfileImg={isNewSender}>{getTextWithTags(content)}</MessageText>
  );

  const spacing = isNewSender ? <Content.Spacing /> : <Content.Spacing16px />;

  return (
    <div>
      {spacing}
      <Container>
        {profileImg}
        <div>
          {header}
          {text}
        </div>
      </Container>
    </div>
  );
};

const Container = styled.div`
  display: flex;

  :hover {
    background-color: ${Colors.greys.light};
  }
`;

const TagText = styled(Fonts.A)`
  color: ${props => (props.isSelected ? Colors.primary.red : Colors.greys.secondary)};
`;

const Timestamp = styled.span`
  color: ${Colors.greys.supporting};
`;

const MessageText = styled(Fonts.P)`
  word-wrap: break-word
  white-space: pre-line;
  line-height: 1.5em;
  margin-left: ${props => (props.hasProfileImg ? '16px' : '56px')};
  margin-right: 56px;
`;

Message.propTypes = propTypes;
Message.defaultProps = defaultProps;

export default Message;
