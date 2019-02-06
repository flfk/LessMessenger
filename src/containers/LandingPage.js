import mixpanel from 'mixpanel-browser';
import React from 'react';
import { Redirect } from 'react-router-dom';
import {
  MdLayersClear,
  MdMarkunread,
  MdPhonelinkErase,
  MdTurnedIn,
  MdSpeakerNotes,
  MdHotel,
} from 'react-icons/md';

import Btn from '../components/Btn';
import Fonts from '../utils/Fonts';
import InputText from '../components/InputText';
import {
  Background,
  BackgroundImg,
  Content,
  Feature,
  FooterImg,
  TextHighlight,
  TitleImg,
  WrapperTitle,
} from '../components/landingPage';

class LandingPage extends React.Component {
  state = {
    email: '',
    toSignUp: false,
  };

  componentDidMount() {
    mixpanel.track('Visited Landing Page');
  }

  handleChangeEmail = event => this.setState({ email: event.target.value });

  handleStart = () => this.setState({ toSignUp: true });

  goToSignUp = () => {
    const { email } = this.state;
    mixpanel.track('Clicked Start Trial', { email });
    return (
      <Redirect
        push
        to={{
          pathname: '/signup',
          state: { email },
        }}
      />
    );
  };

  render() {
    const { email, toSignUp } = this.state;

    if (toSignUp) return this.goToSignUp();

    return (
      <Background>
        <BackgroundImg />
        <Content isCentered>
          <WrapperTitle>
            <Fonts.H1 isCentered isWhite extraLarge>
              Declutter your messages. <br /> Declutter your mind.
            </Fonts.H1>
            <TitleImg />
            <Fonts.H2>The work messenger for small remote teams</Fonts.H2>
            <WrapperTitle.Btns>
              <InputText
                placeholder="Enter your email"
                value={email}
                onChange={this.handleChangeEmail}
                noMargin
              />
              <Btn primary onClick={this.handleStart}>
                Start Free Trial
              </Btn>
            </WrapperTitle.Btns>
          </WrapperTitle>
          <Feature.Wrapper>
            <Feature>
              <Fonts.H2>
                This messenger <TextHighlight>does not</TextHighlight>
              </Fonts.H2>
              <Fonts.H3>
                <MdLayersClear /> clutter your workspace by saving all messages
              </Fonts.H3>
              <Fonts.H3>
                <MdMarkunread /> make messages unalterable after sending
              </Fonts.H3>
              <Fonts.H3>
                <MdPhonelinkErase /> have a mobile app
              </Fonts.H3>
            </Feature>
            <Feature>
              <Fonts.H2>
                This messenger <TextHighlight>does</TextHighlight>
              </Fonts.H2>
              <Fonts.H3>
                <MdTurnedIn /> filter out noise by saving only what matters to you
              </Fonts.H3>
              <Fonts.H3>
                <MdSpeakerNotes /> let you organize ideas before they're seen by teammates
              </Fonts.H3>
              <Fonts.H3>
                <MdHotel /> let you switch off when you're done working
              </Fonts.H3>
            </Feature>
          </Feature.Wrapper>
          <FooterImg />
        </Content>
      </Background>
    );
  }
}

export default LandingPage;
