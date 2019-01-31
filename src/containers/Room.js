// import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Tinycon from 'tinycon';

import Content from '../components/Content';
import ErrorScreen from '../components/ErrorScreen';
import Fonts from '../utils/Fonts';
import { getPathname } from '../utils/Helpers';
import MessagesPanel from './MessagesPanel';
import { getMemberSubscription } from '../data/members/members.actions';
import { loadRoom, toggleInviteMember } from '../data/room/room.actions';
import { AddMemberPopup, Wrapper } from '../components/room';
import Spinner from '../components/Spinner';
import SignUp from './SignUp';
// import TagPanel from './TagPanel';

const propTypes = {
  actionGetMemberSubscription: PropTypes.func.isRequired,
  actionLoadRoom: PropTypes.func.isRequired,
  actionToggleInviteMember: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  isInvitingMember: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  memberUserIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  userId: PropTypes.string,
};

const defaultProps = {
  userId: '',
};

const mapStateToProps = state => ({
  error: state.room.error,
  isInvitingMember: state.room.isInvitingMember,
  isLoading: state.room.isLoading,
  memberUserIds: state.room.memberUserIds,
  userId: state.user.id,
});

const mapDispatchToProps = dispatch => ({
  actionGetMemberSubscription: roomId => dispatch(getMemberSubscription(roomId)),
  actionLoadRoom: pathname => dispatch(loadRoom(pathname)),
  actionToggleInviteMember: () => dispatch(toggleInviteMember()),
});

class Room extends React.Component {
  state = {
    toLandingPage: false,
    subscriptions: [],
  };

  componentDidMount() {
    const pathname = getPathname(this.props);
    if (pathname) {
      this.loadRoom(pathname);
    } else {
      this.setState({ toLandingPage: true });
    }
  }

  componentDidUpdate(prevProps) {
    const { memberUserIds, userId } = this.props;
    if (userId && !prevProps.userId && memberUserIds) {
      this.loadMembers(memberUserIds, userId);
    }
    // this.handleFaviconAlert();
  }

  componentWillUnmount() {
    const { subscriptions } = this.state;
    subscriptions.map(sub => sub());
  }

  goToLandingPage = () => (
    <Redirect
      push
      to={{
        pathname: '/home',
      }}
    />
  );

  handleFaviconAlert = () => {
    Tinycon.setOptions({
      width: 10,
      height: 10,
      color: '#4286f4',
      background: '#4286f4',
    }).setBubble(' ');
  };

  loadRoom = async pathname => {
    const { actionLoadRoom } = this.props;
    const room = await actionLoadRoom(pathname);
  };

  loadMembers = async (memberUserIds, userId) => {
    const hasRoomAccess = memberUserIds.indexOf(userId) > -1;
    if (hasRoomAccess) {
      this.subscribeMembers(memberUserIds);
    }
  };

  subscribeMembers = async memberUserIds => {
    const { subscriptions } = this.state;
    const { actionGetMemberSubscription } = this.props;
    const newSubs = await Promise.all(
      memberUserIds.map(async userId => {
        const newSub = await actionGetMemberSubscription(userId);
        return newSub;
      })
    );
    const subscriptionsUpdated = [...subscriptions, ...newSubs];
    this.setState({ subscriptions: subscriptionsUpdated });
  };

  render() {
    const { toLandingPage } = this.state;
    const {
      actionToggleInviteMember,
      error,
      isInvitingMember,
      isLoading,
      memberUserIds,
      userId,
    } = this.props;

    if (toLandingPage) return this.goToLandingPage();

    if (error) return <ErrorScreen />;

    if (isLoading) return <Spinner />;

    if (!userId) return <SignUp />;

    const hasRoomAccess = memberUserIds.indexOf(userId) > -1;
    if (!hasRoomAccess)
      return (
        <Content>
          <Fonts.H2 isCentered>
            Oops, looks like you don't have access to this workspace. Contact your room
            administrator to request an invitation.
          </Fonts.H2>
        </Content>
      );

    const addMemberPopup = isInvitingMember ? (
      <AddMemberPopup handleClose={actionToggleInviteMember} />
    ) : null;

    return (
      <Wrapper>
        <MessagesPanel />
        {addMemberPopup}
      </Wrapper>
    );
  }
}

Room.propTypes = propTypes;
Room.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Room);
