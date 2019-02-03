import axios from 'axios';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Lottie from 'react-lottie';

// import animationOnline from '../../assets/Online.json';
// import animationTypingStart from '../../assets/TypingStart.json';
// import animationTypingMid from '../../assets/TypingMiddle.json';
// import animationTypingEnd from '../../assets/TypingEnd.json';

const propTypes = {
  avatar: PropTypes.shape({
    animationOnlineURL: PropTypes.string.isRequired,
    animationTypingStartURL: PropTypes.string.isRequired,
    animationTypingMidURL: PropTypes.string.isRequired,
    animationTypingEndURL: PropTypes.string.isRequired,
  }).isRequired,
  isOnline: PropTypes.bool,
  isTyping: PropTypes.bool,
};

const defaultProps = {
  isOnline: false,
  isTyping: false,
};

class MemberAnimation extends React.Component {
  state = {
    currentAnimationData: null,
    animationTypingStartData: null,
    animationTypingMidData: null,
    animationTypingEndData: null,
    animationOnlineData: null,
    hasLoadedData: false,
    isLooping: false,
    isStopped: false,
  };

  componentDidMount() {
    this.loadAnimationData();
  }

  componentDidUpdate(prevProps) {
    const { animationTypingStartData, animationTypingEndData } = this.state;
    const { isTyping } = this.props;
    if (isTyping && !prevProps.isTyping) {
      this.setState({ currentAnimationData: animationTypingStartData });
    }
    if (!isTyping && prevProps.isTyping) {
      this.setState({ currentAnimationData: animationTypingEndData, isLooping: false });
    }
  }

  handleStartTypingComplete = () => {
    const { animationTypingMidData } = this.state;
    this.setState({ currentAnimationData: animationTypingMidData, isLooping: true });
  };

  handleStopTypingComplete = () => {
    const { animationOnlineData } = this.state;
    this.setState({ currentAnimationData: animationOnlineData, isLooping: false, isStopped: true });
  };

  loadAnimationData = async () => {
    const { avatar } = this.props;
    const animationOnline = await axios.get(avatar.animationOnlineURL);
    const animationTypingStart = await axios.get(avatar.animationTypingStartURL);
    const animationTypingMid = await axios.get(avatar.animationTypingMidURL);
    const animationTypingEnd = await axios.get(avatar.animationTypingEndURL);
    this.setState({
      currentAnimationData: animationOnline.data,
      animationOnlineData: animationOnline.data,
      animationTypingStartData: animationTypingStart.data,
      animationTypingMidData: animationTypingMid.data,
      animationTypingEndData: animationTypingEnd.data,
      hasLoadedData: true,
    });
  };

  render() {
    const { currentAnimationData, hasLoadedData, isLooping, isStopped } = this.state;
    const { isOnline, isTyping } = this.props;

    if (!isOnline || !hasLoadedData || !currentAnimationData) return null;

    console.log('Animation In Office animationData is', currentAnimationData);

    const defaultOptions = {
      loop: isLooping,
      autoplay: true,
      animationData: currentAnimationData,
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
