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
import {
  addUserIdToMembers,
  inviteMember,
  loadRoom,
  toggleInviteMember,
} from '../data/room/room.actions';
import { AddMemberPopup, Wrapper } from '../components/room';
import Spinner from '../components/Spinner';
import SignUp from './SignUp';
// import TagPanel from './TagPanel';

const propTypes = {
  actionAddUserIdToMembers: PropTypes.func.isRequired,
  actionGetMemberSubscription: PropTypes.func.isRequired,
  actionInviteMember: PropTypes.func.isRequired,
  actionLoadRoom: PropTypes.func.isRequired,
  actionToggleInviteMember: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  isInvitingMember: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  emailsInvited: PropTypes.arrayOf(PropTypes.string),
  memberUserIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  roomId: PropTypes.string.isRequired,
  roomName: PropTypes.string.isRequired,
  roomPathname: PropTypes.string.isRequired,
  userId: PropTypes.string,
  userName: PropTypes.string,
};

const defaultProps = {
  emailsInvited: [],
  userId: '',
  userEmail: '',
};

const mapStateToProps = state => ({
  error: state.room.error,
  isInvitingMember: state.room.isInvitingMember,
  isLoading: state.room.isLoading,
  emailsInvited: state.room.emailsInvited,
  memberUserIds: state.room.memberUserIds,
  roomId: state.room.id,
  roomName: state.room.name,
  roomPathname: state.room.pathname,
  userId: state.user.id,
  userName: state.user.name,
});

const mapDispatchToProps = dispatch => ({
  actionAddUserIdToMembers: (roomId, userId) => dispatch(addUserIdToMembers(roomId, userId)),
  actionGetMemberSubscription: roomId => dispatch(getMemberSubscription(roomId)),
  actionInviteMember: (email, inviterName, roomId, roomName, roomPathname) =>
    dispatch(inviteMember(email, inviterName, roomId, roomName, roomPathname)),
  actionLoadRoom: pathname => dispatch(loadRoom(pathname)),
  actionToggleInviteMember: () => dispatch(toggleInviteMember()),
});

class Room extends React.Component {
  state = {
    hasRoomAccess: false,
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
    const { emailsInvited, memberUserIds, roomId, userEmail, userId } = this.props;
    if (userId && !prevProps.userId && memberUserIds) {
      const hasRoomAccess = memberUserIds.indexOf(userId) > -1;
      if (hasRoomAccess) {
        this.subscribeMembers(memberUserIds);
      } else if (emailsInvited.indexOf(userEmail) > -1) {
        this.subscribeMembers([...memberUserIds, userId]);
        this.addEmailInvitedToMemberUserIds(roomId);
      }
      this.setState({ hasRoomAccess });
    }
  }

  componentWillUnmount() {
    const { subscriptions } = this.state;
    subscriptions.map(sub => sub());
  }

  addEmailInvitedToMemberUserIds = () => {
    const { actionAddUserIdToMembers, userId, roomId } = this.props;
    actionAddUserIdToMembers(roomId, userId);
  };

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

  handleInviteMember = email => {
    const { actionInviteMember, roomId, roomName, roomPathname, userName } = this.props;
    actionInviteMember((email, userName, roomId, roomName, roomPathname));
  };

  loadRoom = async pathname => {
    const { actionLoadRoom } = this.props;
    await actionLoadRoom(pathname);
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
    const { hasRoomAccess, toLandingPage } = this.state;
    const { actionToggleInviteMember, error, isInvitingMember, isLoading, userId } = this.props;

    if (toLandingPage) return this.goToLandingPage();

    if (error) return <ErrorScreen />;

    if (isLoading) return <Spinner />;

    if (!userId) return <SignUp />;

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
      <AddMemberPopup
        handleClose={actionToggleInviteMember}
        handleInviteMember={this.handleInviteMember}
      />
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
