import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import Btn from '../components/Btn';
import Fonts from '../utils/Fonts';

import { Dropdown, List, Profile, Wrapper } from '../components/navBar';

import { auth } from '../data/firebase';
import { getLoggedInUser, signOut } from '../data/user/user.actions';

const propTypes = {
  actionGetLoggedInUser: PropTypes.func.isRequired,
  actionSignOut: PropTypes.func.isRequired,
  roomName: PropTypes.string,
  userId: PropTypes.string,
};

const defaultProps = {
  roomName: '',
  userId: '',
};

const mapStateToProps = state => ({
  members: state.members,
  roomName: state.room.name,
  userId: state.user.id,
});

const mapDispatchToProps = dispatch => ({
  actionGetLoggedInUser: user => dispatch(getLoggedInUser(user)),
  actionSignOut: () => dispatch(signOut()),
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

    const { actionSignOut, members, roomName, userId } = this.props;

    const dropdown = showDropDown ? (
      <Dropdown>
        <Btn.Tertiary fill>test</Btn.Tertiary>
      </Dropdown>
    ) : null;

    const profileBtn = userId ? (
      <li>
        <Btn.Tertiary onClick={actionSignOut}>Sign Out</Btn.Tertiary>
      </li>
    ) : null;

    const user = members.find(member => member.id === userId);
    const membersSorted = members
      // .sort((a, b) => moment.tz(b.timezone).utcOffset - moment.tz(a.timezone).utcOffset)
      .filter(member => member.id !== userId);
    if (user) membersSorted.push(user);

    const memberProfiles = membersSorted.map(member => {
      const isUser = member.id === userId;
      return (
        <Profile key={member.id}>
          <Profile.Img src={member.profileImgURL} />
          <Profile.TextWrapper>
            <Fonts.FinePrint>{isUser ? `${member.name} (you)` : member.name}</Fonts.FinePrint>
            <Fonts.P>
              {moment()
                .tz(member.timezone)
                .format('h:m a')}
            </Fonts.P>
          </Profile.TextWrapper>
        </Profile>
      );
    });

    return (
      <div>
        <Wrapper>
          <List>
            <li>
              <strong>{roomName}</strong>
            </li>
            {memberProfiles}
            {profileBtn}
          </List>
        </Wrapper>
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
