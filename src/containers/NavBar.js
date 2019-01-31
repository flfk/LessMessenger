import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import Btn from '../components/Btn';
import { auth } from '../data/firebase';
import Fonts from '../utils/Fonts';
import { Dropdown, List, Profile, Wrapper } from '../components/navBar';
import { getMembersState } from '../data/members/members.selectors';
import { getLoggedInUser, signOut } from '../data/user/user.actions';

const MILLIS_PER_SECOND = 1000;

const propTypes = {
  actionGetLoggedInUser: PropTypes.func.isRequired,
  actionSignOut: PropTypes.func.isRequired,
  roomName: PropTypes.string,
  userId: PropTypes.string,
};

const defaultProps = {
  roomName: '',
  roomMemberUserIds: [],
  userId: '',
};

const mapStateToProps = state => ({
  members: getMembersState(state),
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
    timestamp: 0,
  };

  componentDidMount() {
    this.getSignedInUser();
    this.startClock();
  }

  componentWillUnmount() {
    this.stopClock();
  }

  getSignedInUser = async () => {
    const { actionGetLoggedInUser } = this.props;
    await auth.onAuthStateChanged(user => {
      if (user) actionGetLoggedInUser(user);
    });
  };

  handleClickProfile = () => {
    // this.setState({ showDropDown: true });
  };

  startClock = () => {
    this.interval = setInterval(() => {
      this.setState({ timestamp: moment().valueOf() });
    }, MILLIS_PER_SECOND);
  };

  stopClock = () => {
    clearInterval(this.interval);
  };

  render() {
    const { showDropDown, timestamp } = this.state;

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

    const memberProfiles = !userId
      ? null
      : membersSorted.map(member => {
          const isUser = member.id === userId;
          return (
            <Profile key={member.id}>
              <Profile.ImgWrapper>
                <Profile.Img src={member.avatar.profileImgURL} />
                <Profile.Presence isOnline={member.isOnline} />
              </Profile.ImgWrapper>
              <Profile.TextWrapper>
                <Fonts.Label isSecondary>
                  {isUser ? `${member.name} (you)` : member.name}
                </Fonts.Label>
                <Fonts.P>
                  {moment(timestamp)
                    .tz(member.timezone)
                    .format('h:mm a')}
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
              <Fonts.H2 isSecondary>{roomName}</Fonts.H2>
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
