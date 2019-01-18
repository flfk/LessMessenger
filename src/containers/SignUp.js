import mixpanel from 'mixpanel-browser';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import validator from 'validator';

import Btn from '../components/Btn';
import Content from '../components/Content';
import Fonts from '../utils/Fonts';
import InputText from '../components/InputText';
import Spinner from '../components/Spinner';
import LogIn from './LogIn';
import { getParams } from '../utils/Helpers';

import { createUser } from '../data/user/user.actions';

const propTypes = {
  actionSignUp: PropTypes.func.isRequired,
  errorCode: PropTypes.string,
  isPending: PropTypes.bool,
};

const defaultProps = {
  errorCode: '',
  isPending: false,
};

const mapStateToProps = state => ({
  errorCode: state.user.errorCode,
  isPending: state.user.isPending,
});

const mapDispatchToProps = dispatch => ({
  actionSignUp: (email, name, password) => dispatch(createUser(email, name, password)),
});

class SignUp extends React.Component {
  state = {
    name: '',
    nameErrMsg: '',
    nameIsValid: false,
    email: '',
    emailErrMsg: '',
    emailIsValid: false,
    isLoading: false,
    password: '',
    passwordErrMsg: '',
    passwordIsValid: false,
    showLogIn: false,
  };

  componentDidMount() {
    // mixpanel.track('Visited Sign Up Page');
    // this.setData();
  }

  getErrorText = errorCode => {
    console.log(errorCode);
    if (errorCode === 'auth/email-already-in-use') {
      return 'You already have an account with this email. Try logging in.';
    }
    return "Oops, something wen't wrong. Please try again or contact us at ilydotsm@gmail.com for help.";
  };

  handleBlur = field => () => {
    let isValid = false;
    if (field === 'email') isValid = this.isEmailValid();
    if (field === 'name') isValid = this.isNameValid();
    if (field === 'password') isValid = this.isPasswordValid();
    const validFieldId = `${field}IsValid`;
    this.setState({ [validFieldId]: isValid });
  };

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

  handleClickLogIn = () => this.setState({ showLogIn: true });

  handleSignUp = () => {
    this.setState({ isLoading: true });
    if (this.isFormValid()) {
      const { email, name, password } = this.state;
      const { actionSignUp } = this.props;
      actionSignUp(email, name, password);
      // mixpanel.alias(email);
      // mixpanel.people.set({
      //   $name: usernameFormatted,
      // });
      // mixpanel.people.set({ username: usernameFormatted });
      // mixpanel.track('Signed Up');
    }
    this.setState({ isLoading: false });
  };

  isFormValid = () => {
    if (this.isEmailValid() && this.isNameValid() && this.isPasswordValid()) {
      return true;
    }
    return false;
  };

  isEmailValid = () => {
    const { email } = this.state;
    if (!validator.isEmail(email)) {
      this.setState({ emailErrMsg: 'Valid email address required.' });
      return false;
    }
    this.setState({ emailErrMsg: '' });
    return true;
  };

  isNameValid = () => {
    const { name } = this.state;
    if (name === '') {
      this.setState({ nameErrMsg: "Don't forget to include your name." });
      return false;
    }
    this.setState({ nameErrMsg: '' });
    return true;
  };

  isPasswordValid = () => {
    const { password } = this.state;
    if (password.length < 6) {
      this.setState({ passwordErrMsg: 'Your password needs to be at least 6 characters.' });
      return false;
    }
    this.setState({ passwordErrMsg: '' });
    return true;
  };

  render() {
    const {
      email,
      emailErrMsg,
      emailIsValid,
      isLoading,
      name,
      nameErrMsg,
      nameIsValid,
      password,
      passwordErrMsg,
      passwordIsValid,
      showLogIn,
    } = this.state;

    const { errorCode, isPending } = this.props;

    if (showLogIn) return <LogIn />;

    if (isLoading || isPending) return <Spinner />;

    const signUpErrMsg = errorCode ? (
      <Fonts.ERROR>{this.getErrorText(errorCode)}</Fonts.ERROR>
    ) : null;

    return (
      <Content>
        <Content.Spacing16px />
        <Fonts.H1 centered>Sign up to join this workspace</Fonts.H1>
        <InputText
          errMsg={nameErrMsg}
          label="First off, What's your name?"
          placeholder="Jane Doe"
          onBlur={this.handleBlur('name')}
          onChange={this.handleChangeInput('name')}
          value={name}
          isValid={nameIsValid}
        />
        <InputText
          errMsg={emailErrMsg}
          label="Tell us your email"
          placeholder="example@email.com"
          onBlur={this.handleBlur('email')}
          onChange={this.handleChangeInput('email')}
          value={email}
          isValid={emailIsValid}
        />
        <InputText
          errMsg={passwordErrMsg}
          label="Create a Password"
          placeholder="Password"
          onBlur={this.handleBlur('password')}
          onChange={this.handleChangeInput('password')}
          value={password}
          isPassword
          isValid={passwordIsValid}
        />
        <Content.Spacing8px />
        {signUpErrMsg}
        <Btn primary short onClick={this.handleSignUp}>
          Sign Up
        </Btn>
        <Content.Spacing16px />
        <Content.Centered>
          <Fonts.P>Already using Meetsta?</Fonts.P>{' '}
          <Btn.Tertiary onClick={this.handleClickLogIn}>Log In</Btn.Tertiary>
        </Content.Centered>
      </Content>
    );
  }
}

// <Content>
//   <Fonts.Label>
//     By clicking on Sign Up, you agree with the{' '}
//     <Link to="/termsConditions" target="_blank" style={{ textDecoration: 'none' }}>
//       <Fonts.Link>Terms and Conditions of Use</Fonts.Link>
//     </Link>{' '}
//     and{' '}
//     <Link to="/privacyPolicy" target="_blank" style={{ textDecoration: 'none' }}>
//       <Fonts.Link>Privacy Policy</Fonts.Link>
//     </Link>
//     .
//   </Fonts.Label>
// </Content>;

SignUp.propTypes = propTypes;
SignUp.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
