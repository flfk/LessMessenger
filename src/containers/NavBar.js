import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Btn from '../components/Btn';
import NavBarDropdown from '../components/NavBarDropdown';
import NavBarWrapper from '../components/NavBarWrapper';
import NavBarList from '../components/NavBarList';

import { auth } from '../data/firebase';
import { getLoggedInUser } from '../data/user/user.actions';

const propTypes = {
  actionGetLoggedInUser: PropTypes.func.isRequired,
  roomName: PropTypes.string,
  userID: PropTypes.string,
};

const defaultProps = {
  roomName: '',
  userID: '',
};

const mapStateToProps = state => ({
  userID: state.user.id,
  roomName: state.room.name,
});

const mapDispatchToProps = dispatch => ({
  actionGetLoggedInUser: user => dispatch(getLoggedInUser(user)),
});

class NavBar extends React.Component {
  state = {
    showDropDown: false,
  };

  componentDidMount() {
    this.getSignedInUser();
  }

  handleClickProfile = () => {
    // this.setState({ showDropDown: true });
  };

  getSignedInUser = async () => {
    const { actionGetLoggedInUser } = this.props;
    await auth.onAuthStateChanged(user => {
      if (user) actionGetLoggedInUser(user);
    });
  };

  render() {
    const { showDropDown } = this.state;

    const { userID } = this.props;

    const dropdown = showDropDown ? (
      <NavBarDropdown>
        <Btn.Tertiary fill>test</Btn.Tertiary>
      </NavBarDropdown>
    ) : null;

    const profileBtn = userID ? (
      <li>
        <Link to="/profile">
          <Btn.Tertiary onClick={this.handleClickProfile}>{userID}</Btn.Tertiary>
        </Link>
      </li>
    ) : null;

    const logInBtn = userID ? null : (
      <li>
        <Link to="/login">
          <Btn.Tertiary narrow short primary>
            Log In
          </Btn.Tertiary>
        </Link>
      </li>
    );

    const signUpBtn = userID ? null : (
      <li>
        <Link to="/signup">
          <Btn narrow short primary>
            Sign Up
          </Btn>
        </Link>
      </li>
    );

    return (
      <div>
        <NavBarWrapper>
          <NavBarList>
            <li>
              <Link to="/home">Home</Link>
            </li>
            {profileBtn}
            {logInBtn}
            {signUpBtn}
          </NavBarList>
        </NavBarWrapper>
        {dropdown}
      </div>
    );
  }
}

NavBar.propTypes = propTypes;
NavBar.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar);
