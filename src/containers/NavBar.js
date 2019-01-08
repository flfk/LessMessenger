import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Btn from '../components/Btn';
import NavBarWrapper from '../components/NavBarWrapper';
import NavBarList from '../components/NavBarList';

import { auth } from '../data/firebase';
import { getLoggedInUser } from '../data/redux/user/user.actions';

const propTypes = {
  actionGetLoggedInUser: PropTypes.func.isRequired,
  username: PropTypes.string,
};

const defaultProps = {
  username: '',
};

const mapStateToProps = state => ({
  username: state.user.username,
});

const mapDispatchToProps = dispatch => ({
  actionGetLoggedInUser: user => dispatch(getLoggedInUser(user)),
});

class NavBar extends React.Component {
  componentDidMount() {
    this.getSignedInUser();
  }

  getSignedInUser = async () => {
    const { actionGetLoggedInUser } = this.props;
    await auth.onAuthStateChanged(user => {
      if (user) actionGetLoggedInUser(user);
    });
  };

  render() {
    const { username } = this.props;

    const profileBtn = username ? (
      <li>
        <Link to="/profile">
          <Btn.Tertiary>{username}</Btn.Tertiary>
        </Link>
      </li>
    ) : null;

    const logInBtn = username ? null : (
      <li>
        <Link to="/login">
          <Btn.Tertiary narrow short primary>
            Log In
          </Btn.Tertiary>
        </Link>
      </li>
    );

    const signUpBtn = username ? null : (
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
              <Link to="/home">
                <Wrapper.Logo>
                  <img src={Icon} alt="" />
                </Wrapper.Logo>
              </Link>
            </li>
            {profileBtn}
            {logInBtn}
            {signUpBtn}
          </NavBarList>
        </NavBarWrapper>
      </div>
    );
  }
}

NavBar.propTypes = propTypes;
NavBar.defaultProps = defaultProps;

// const NavBar = () => <div />;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar);
