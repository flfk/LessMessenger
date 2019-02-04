import mixpanel from 'mixpanel-browser';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import validator from 'validator';

import Btn from '../components/Btn';
import Content from '../components/Content';
import Fonts from '../utils/Fonts';
import InputText from '../components/InputText';
import Spinner from '../components/Spinner';
import LogIn from './LogIn';

import { createRoom, inviteMember } from '../data/room/room.actions';
import { createUser } from '../data/user/user.actions';

const propTypes = {
  actionCreateRoom: PropTypes.func.isRequired,
  actionInviteMember: PropTypes.func.isRequired,
  actionSignUp: PropTypes.func.isRequired,
  errorCode: PropTypes.string,
  isPending: PropTypes.bool,
  newRoomPathname: PropTypes.string,
  userId: PropTypes.string,
  userName: PropTypes.string,
};

const defaultProps = {
  errorCode: '',
  isPending: false,
  newRoomPathname: '',
  userId: '',
  userName: '',
};

const mapStateToProps = state => ({
  errorCode: state.user.errorCode,
  isPending: state.user.isPending,
  newRoomPathname: state.room.pathname,
  userId: state.user.id,
  userName: state.user.name,
});

const mapDispatchToProps = dispatch => ({
  actionCreateRoom: (email, room) => dispatch(createRoom(email, room)),
  actionInviteMember: (email, inviterName, roomId, roomName, roomPathname) =>
    dispatch(inviteMember(email, inviterName, roomId, roomName, roomPathname)),
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
    isCreatingNewRoom: false,
    inviteeEmail: '',
    inviteeEmailErrMsg: '',
    inviteeEmailIsValid: false,
    password: '',
    passwordErrMsg: '',
    passwordIsValid: false,
    roomName: '',
    roomNameErrMsg: '',
    roomNameIsValid: false,
    showLogIn: false,
    toRoom: false,
  };

  componentDidMount() {
    // Check if email passed because sent from landing page
    if (this.props.location) {
      const { email } = this.props.location.state;
      if (email) {
        this.setState({ email, isCreatingNewRoom: true });
        this.isEmailValid(email);
      }
    }
    mixpanel.track('Visited Sign Up Page');
  }

  getErrorText = errorCode => {
    console.log(errorCode);
    if (errorCode === 'auth/email-already-in-use') {
      return 'You already have an account with this email. Try logging in.';
    }
    return "Oops, something wen't wrong. Please try again or contact us at ilydotsm@gmail.com for help.";
  };

  getNewRoom = () => {
    const { inviteeEmail, roomName } = this.state;
    const { userId } = this.props;
    return {
      emailsInvited: [inviteeEmail],
      // memberUserIds: [userId],
      // mostRecentSignInById: {
      //   [userId]: getTimestamp(),
      // },
      members: {
        [userId]: { isOnline: false, isTyping: false, mostRecentSignOut: 0 },
      },
      name: roomName,
      pathname: roomName.replace(' ', '-'),
    };
  };

  handleBlur = field => () => {
    let isValid = false;
    if (field === 'email') isValid = this.isEmailValid();
    if (field === 'inviteeEmail') isValid = this.isInviteeEmailValid();
    if (field === 'name') isValid = this.isNameValid();
    if (field === 'roomName') isValid = this.isRoomNameValid();
    if (field === 'password') isValid = this.isPasswordValid();
    const validFieldId = `${field}IsValid`;
    this.setState({ [validFieldId]: isValid });
  };

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

  handleCreateRoom = async () => {
    if (this.isRoomFormValid()) {
      console.log('handling create room with valid form');
      const { email, inviteeEmail } = this.state;
      const { actionCreateRoom } = this.props;
      const newRoom = this.getNewRoom();
      const roomAdded = await actionCreateRoom(email, newRoom);
      console.log('handleCreateRoom complete', roomAdded);
      mixpanel.track('Created Room', { id: roomAdded.id });
      if (inviteeEmail) {
        this.handleInviteMember(roomAdded);
        mixpanel.track('Invited Teammate', { roomId: roomAdded.id });
      }
      this.setState({ toRoom: true });
    }
  };

  handleClickLogIn = () => this.setState({ showLogIn: true });

  handleSignUp = () => {
    this.setState({ isLoading: true });
    if (this.isSignUpFormValid()) {
      const { email, name, password } = this.state;
      const { actionSignUp } = this.props;
      actionSignUp(email, name, password);
      mixpanel.alias(email);
      mixpanel.people.set({
        $name: name,
        email,
      });
      mixpanel.track('Signed Up');
    }
    this.setState({ isLoading: false });
  };

  handleInviteMember = room => {
    const { inviteeEmail } = this.state;
    const { actionInviteMember, userName } = this.props;
    actionInviteMember(inviteeEmail, userName, room.id, room.name, room.pathname);
  };

  goToRoom = () => {
    const { newRoomPathname } = this.props;
    return (
      <Redirect
        push
        to={{
          pathname: `/${newRoomPathname}`,
        }}
      />
    );
  };

  isRoomFormValid = () => {
    const { inviteeEmail } = this.state;
    return this.isRoomNameValid() && (!inviteeEmail || this.isInviteeEmailValid());
  };

  isSignUpFormValid = () => {
    if (this.isEmailValid() && this.isNameValid() && this.isPasswordValid()) {
      return true;
    }
    return false;
  };

  isEmailValid = (emailInput = '') => {
    const email = emailInput || this.state.email;
    if (!validator.isEmail(email)) {
      this.setState({ emailErrMsg: 'Valid email address required.' });
      return false;
    }
    this.setState({ emailErrMsg: '', emailIsValid: true });
    return true;
  };

  isInviteeEmailValid = () => {
    const { inviteeEmail } = this.state;
    if (inviteeEmail && !validator.isEmail(inviteeEmail)) {
      this.setState({ inviteeEmailErrMsg: 'Valid Email address required.' });
      return false;
    }
    this.setState({ inviteeEmailErrMsg: '', inviteeEmailIsValid: true });
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

  isRoomNameValid = () => {
    const { roomName } = this.state;
    if (roomName === '') {
      this.setState({ roomNameErrMsg: "Don't forget to include a name for your workspace." });
      return false;
    }
    this.setState({ roomNameErrMsg: '' });
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
      isCreatingNewRoom,
      inviteeEmail,
      inviteeEmailErrMsg,
      inviteeEmailIsValid,
      name,
      nameErrMsg,
      nameIsValid,
      password,
      passwordErrMsg,
      passwordIsValid,
      roomName,
      roomNameErrMsg,
      roomNameIsValid,
      showLogIn,
      toRoom,
    } = this.state;

    const { errorCode, isPending, newRoomPathname, userId } = this.props;

    if (showLogIn) return <LogIn />;

    if (isLoading || isPending) return <Spinner />;

    const signUpErrMsg = errorCode ? <Fonts.Err>{this.getErrorText(errorCode)}</Fonts.Err> : null;

    if (isCreatingNewRoom && toRoom && newRoomPathname) return this.goToRoom();

    const emailDiv =
      isCreatingNewRoom && emailIsValid ? null : (
        <InputText
          errMsg={emailErrMsg}
          label="First off, tell us your email?"
          placeholder="example@email.com"
          onBlur={this.handleBlur('email')}
          onChange={this.handleChangeInput('email')}
          value={email}
          isValid={emailIsValid}
        />
      );

    // Allow room creation
    if (userId && isCreatingNewRoom) {
      return (
        <Content>
          <Content.Spacing16px />
          <Fonts.H2 isCentered>Last question</Fonts.H2>
          <InputText
            errMsg={roomNameErrMsg}
            label="What do you want to call your workspace"
            placeholder="The Office"
            onBlur={this.handleBlur('roomName')}
            onChange={this.handleChangeInput('roomName')}
            value={roomName}
            isValid={roomNameIsValid}
          />
          <InputText
            errMsg={inviteeEmailErrMsg}
            label="Want to invite a teammate right away? (You can skip this or do it later)"
            placeholder="Teammate's email"
            onBlur={this.handleBlur('inviteeEmail')}
            onChange={this.handleChangeInput('inviteeEmail')}
            value={inviteeEmail}
            isValid={inviteeEmailIsValid}
          />
          <Btn primary onClick={this.handleCreateRoom}>
            All Done!
          </Btn>
        </Content>
      );
    }

    return (
      <Content>
        <Content.Spacing16px />
        <Fonts.H2 isCentered>Just a few quick things to sign up</Fonts.H2>
        {emailDiv}
        <InputText
          errMsg={nameErrMsg}
          label="What's your name?"
          placeholder="Jane Doe"
          onBlur={this.handleBlur('name')}
          onChange={this.handleChangeInput('name')}
          value={name}
          isValid={nameIsValid}
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
          <Fonts.P>Already using LessMessenger?</Fonts.P>{' '}
          <Btn.Tertiary onClick={this.handleClickLogIn}>Log In</Btn.Tertiary>
        </Content.Centered>
      </Content>
    );
  }
}

SignUp.propTypes = propTypes;
SignUp.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
