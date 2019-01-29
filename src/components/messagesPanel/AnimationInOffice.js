import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Lottie from 'react-lottie';

import animationOnline from '../../assets/Online.json';
import animationTypingStart from '../../assets/TypingStart.json';
import animationTypingMiddle from '../../assets/TypingMiddle.json';
import animationTypingEnd from '../../assets/TypingEnd.json';

const propTypes = {
  isOnline: PropTypes.bool,
  isTyping: PropTypes.bool,
};

const defaultProps = {
  isOnline: false,
  isTyping: false,
};

class MemberAnimation extends React.Component {
  state = {
    animationData: animationOnline,
    isLooping: false,
    isStopped: false,
  };

  componentDidUpdate(prevProps) {
    const { isTyping } = this.props;
    if (isTyping && !prevProps.isTyping) {
      this.setState({ animationData: animationTypingStart });
    }
    if (!isTyping && prevProps.isTyping) {
      this.setState({ animationData: animationTypingEnd, isLooping: false });
    }
  }

  handleStartTypingComplete = () => {
    this.setState({ animationData: animationTypingMiddle, isLooping: true });
  };

  handleStopTypingComplete = () => {
    this.setState({ animationData: animationOnline, isLooping: false, isStopped: true });
  };

  render() {
    const { animationData, isLooping, isStopped } = this.state;
    const { isOnline, isTyping } = this.props;

    if (!isOnline) return null;

    const defaultOptions = {
      loop: isLooping,
      autoplay: true,
      animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

    const eventListeners = !isTyping
      ? []
      : [
          {
            eventName: 'complete',
            callback: this.handleStartTypingComplete,
          },
        ];

    return (
      <WrapperItem>
        <Lottie
          options={defaultOptions}
          height={48}
          width={48}
          isStopped={isStopped}
          eventListeners={eventListeners}
        />
      </WrapperItem>
    );
  }
}

MemberAnimation.propTypes = propTypes;
MemberAnimation.defaultProps = defaultProps;

const Wrapper = styled.div`
  // overflow: visible;
  margin-top: -12px;
  margin-left: 64px;
  height: 48px;
  width: 300px;
  display: flex;
  align-items: flex-end;
`;

const WrapperItem = styled.div`
  margin-right: 16px;
`;

MemberAnimation.Wrapper = Wrapper;

export default MemberAnimation;
