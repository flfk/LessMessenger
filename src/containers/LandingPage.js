import React from 'react';
import styled from 'styled-components';

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
  };

  handleChangeEmail = event => this.setState({ email: event.target.value });

  render() {
    const { email } = this.state;

    return (
      <Background>
        <BackgroundImg />
        <Content isCentered>
          <WrapperTitle>
            <Fonts.H1 isCentered isWhite extraLarge>
              Declutter your messages. <br /> Declutter your mind.
            </Fonts.H1>
            <TitleImg />
            <WrapperTitle.Btns>
              <InputText
                placeholder="Enter your email"
                value={email}
                onChange={this.handleChangeEmail}
                noMargin
              />
              <Btn primary>Get Started</Btn>
            </WrapperTitle.Btns>
          </WrapperTitle>
          <Feature.Wrapper>
            <Feature>
              <Fonts.H2>
                This messenger <TextHighlight>does not</TextHighlight>
              </Fonts.H2>
              <Fonts.H3>hoard unimportant messages</Fonts.H3>
              <Fonts.H3>set messages in stone once they're sent</Fonts.H3>
              <Fonts.H3>follow you around on your phone 24-7</Fonts.H3>
            </Feature>
            <Feature>
              <Fonts.H2>
                This messenger <TextHighlight>does</TextHighlight>
              </Fonts.H2>
              <Fonts.H3>keep messages that matter and discard the rest</Fonts.H3>
              <Fonts.H3>allow you to refine ideas even after they're sent</Fonts.H3>
              <Fonts.H3>let you choose when you're done working</Fonts.H3>
            </Feature>
          </Feature.Wrapper>
          <FooterImg />
        </Content>
      </Background>
    );
  }
}

export default LandingPage;
