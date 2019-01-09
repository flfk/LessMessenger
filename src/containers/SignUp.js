import mixpanel from 'mixpanel-browser';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import validator from 'validator';

import Btn from '../components/Btn';
import Content from '../components/Content';
import InputText from '../components/InputText';
import Spinner from '../components/Spinner';
import Fonts from '../utils/Fonts';
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
  actionSignUp: (email, password) => dispatch(createUser(email, password)),
});

class SignUp extends React.Component {
  state = {
    email: '',
    emailErrMsg: '',
    emailIsValid: false,
    isLoading: true,
    password: '',
    passwordErrMsg: '',
    passwordIsValid: false,
  };

  componentDidMount() {
    // mixpanel.track('Visited Sign Up Page');
    // this.setData();
  }

  getErrorText = errorCode => {
    if (errorCode === 'auth/email-already-in-use') {
      return 'You already have an account with this email. Try logging in.';
    }
    return "Oops, something wen't wrong. Please try again or contact us at ilydotsm@gmail.com for help.";
  };

  handleBlur = field => () => {
    let isValid = false;
    if (field === 'email') isValid = this.isEmailValid();
    if (field === 'password') isValid = this.isPasswordValid();
    const validFieldID = `${field}IsValid`;
    this.setState({ [validFieldID]: isValid });
  };

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

  handleSignUp = () => {
    this.setState({ isLoading: true });
    if (this.isFormValid()) {
      const { email, password } = this.state;
      const { actionSignUp } = this.props;
      actionSignUp(email, password);
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
    if (this.isEmailValid() && this.isPasswordValid()) {
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

  isPasswordValid = () => {
    const { password } = this.state;
    if (password.length < 6) {
      this.setState({ passwordErrMsg: 'Your password needs to be at least 6 characters.' });
      return false;
    }
    this.setState({ passwordErrMsg: '' });
    return true;
  };

  // setData = async () => {
  //   const { i } = getParams(this.props);
  //   if (i) {
  //     const influencer = await actions.fetchDocInfluencerByID(i);
  //     this.setState({ influencer });
  //   }
  //   this.setState({ isLoading: false });
  // };

  render() {
    const {
      email,
      emailErrMsg,
      emailIsValid,
      isLoading,
      item,
      password,
      passwordErrMsg,
      passwordIsValid,
    } = this.state;

    const { errorCode, isPending } = this.props;

    // if (isLoading || isPending) return <Spinner />;

    const signUpErrMsg = errorCode ? (
      <Fonts.ERROR>{this.getErrorText(errorCode)}</Fonts.ERROR>
    ) : null;

    return (
      <Content>
        <Content.Spacing16px />
        <Fonts.H1 centered>Sign up to message in the workspace</Fonts.H1>
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
      </Content>
    );
  }
}

// <Content>
//   <Fonts.FinePrint>
//     By clicking on Sign Up, you agree with the{' '}
//     <Link to="/termsConditions" target="_blank" style={{ textDecoration: 'none' }}>
//       <Fonts.Link>Terms and Conditions of Use</Fonts.Link>
//     </Link>{' '}
//     and{' '}
//     <Link to="/privacyPolicy" target="_blank" style={{ textDecoration: 'none' }}>
//       <Fonts.Link>Privacy Policy</Fonts.Link>
//     </Link>
//     .
//   </Fonts.FinePrint>
// </Content>;

SignUp.propTypes = propTypes;
SignUp.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
