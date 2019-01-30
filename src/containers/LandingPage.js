import React from 'react';
import styled from 'styled-components';

import Btn from '../components/Btn';
import Fonts from '../utils/Fonts';
import InputText from '../components/InputText';
import {
  Background,
  BackgroundImg,
  Content,
  TitleImg,
  WrapperFeatures,
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
            <div>
              <InputText
                placeholder="Enter your email"
                value={email}
                onChange={this.handleChangeEmail}
                marginBottom8px
              />
              <Btn primary>Start</Btn>
            </div>
          </WrapperTitle>
          <WrapperFeatures>
            <div>
              <Fonts.H2>
                This messenger <strong>does not</strong>
              </Fonts.H2>
              <Fonts.H3>hoard unimportant messages</Fonts.H3>
              <Fonts.H3>set messages in stone once they're sent</Fonts.H3>
              <Fonts.H3>follow you around on your phone 24-7</Fonts.H3>
            </div>
            <div>
              <Fonts.H2>
                This messenger <strong>does</strong>
              </Fonts.H2>
              <Fonts.H3>keep messages that matter and discard the rest</Fonts.H3>
              <Fonts.H3>allow you to refine ideas even after they're sent</Fonts.H3>
              <Fonts.H3>let you choose when you're done working</Fonts.H3>
            </div>
          </WrapperFeatures>
        </Content>
      </Background>
    );
  }
}

export default LandingPage;
