import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import Btn from '../components/Btn';
import { auth } from '../data/firebase';
import Fonts from '../utils/Fonts';
import { AddMemberIcon, Dropdown, List, Profile, Wrapper } from '../components/navBar';
import { toggleInviteMember } from '../data/room/room.actions';
import { getMembersState } from '../data/members/members.selectors';
import { getLoggedInUser, signOut } from '../data/user/user.actions';

const MILLIS_PER_SECOND = 1000;

const propTypes = {
  actionGetLoggedInUser: PropTypes.func.isRequired,
  actionToggleInviteMember: PropTypes.func.isRequired,
  actionSignOut: PropTypes.func.isRequired,
  roomName: PropTypes.string,
  userId: PropTypes.string,
};

const defaultProps = {
  roomName: '',
  userId: '',
};

const mapStateToProps = state => ({
  members: getMembersState(state),
  roomMembers: state.room.members,
  roomName: state.room.name,
  userId: state.user.id,
});

const mapDispatchToProps = dispatch => ({
  actionGetLoggedInUser: user => dispatch(getLoggedInUser(user)),
  actionToggleInviteMember: () => dispatch(toggleInviteMember()),
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

  handleAddMember = () => {
    const { actionToggleInviteMember } = this.props;
    actionToggleInviteMember();
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
    const { showDropDown, timestamp, showPopupAddMember } = this.state;

    const {
      actionToggleInviteMember,
      actionSignOut,
      members,
      roomMembers,
      roomName,
      userId,
    } = this.props;

    const dropdown = showDropDown ? (
      <Dropdown>
        <Btn.Tertiary fill>test</Btn.Tertiary>
      </Dropdown>
    ) : null;

    const addMemberBtn =
      userId && members && members.length > 0 ? (
        <li>
          <Btn.Tertiary onClick={actionToggleInviteMember}>
            <AddMemberIcon />
          </Btn.Tertiary>
        </li>
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
          const { isOnline } = roomMembers[member.id];
          return (
            <Profile key={member.id}>
              <Profile.ImgWrapper>
                <Profile.Img src={member.avatar.profileImgURL} />
                <Profile.Presence isOnline={isOnline} />
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
            {addMemberBtn}
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
