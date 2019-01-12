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

const propTypes = {
  content: PropTypes.string.isRequired,
  downloadURL: PropTypes.string,
  isAttachment: PropTypes.bool,
  isNewSender: PropTypes.bool.isRequired,
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
  selectTag,
  senderName,
  timestamp,
  type,
}) => {
  const getTextWithTags = text => {
    const words = text.split(' ').map((word, index) => {
      if (word[0] !== '#') return (word += ' ');
      return (
        <Fonts.A key={`${timestamp}${index}`} onClick={selectTag(word)}>
          {word}{' '}
        </Fonts.A>
      );
    });
    return (
      <Linkify properties={{ target: '_blank' }}>
        <Fonts.P>{words}</Fonts.P>
      </Linkify>
    );
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

  const header = isNewSender ? (
    <div>
      <Content.Spacing />
      <Fonts.P>
        <strong> {senderName} </strong>
        {moment(timestamp).format('h:mm a')}
      </Fonts.P>
    </div>
  ) : null;

  const text = isAttachment ? (
    <MessageText>
      <Btn.Tertiary onClick={handleDownload}>{content}</Btn.Tertiary>
    </MessageText>
  ) : (
    getTextWithTags(content)
  );

  return (
    <Container>
      {header}
      {text}
    </Container>
  );
};

const Container = styled.div`
  :hover {
    background-color: ${Colors.greys.light};
  }
`;

const MessageText = styled(Fonts.P)`
  word-wrap: break-word
  white-space: pre-line;
  line-height: 2em;
  font-size: 14px;
`;

Message.propTypes = propTypes;
Message.defaultProps = defaultProps;

export default Message;
