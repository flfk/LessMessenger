import mixpanel from 'mixpanel-browser';
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
import { cancelReply, sendMessage, uploadFile } from '../data/messages/messages.actions';
import {
  addUserIdToMembers,
  changeUserStatusToOnline,
  getRoomSubscription,
  inviteMember,
  toggleInviteMember,
} from '../data/room/room.actions';
import { getMemberIds } from '../data/room/room.selectors';
import { AddMemberPopup, Wrapper } from '../components/room';
import Spinner from '../components/Spinner';
import SignUp from './SignUp';
// import TagPanel from './TagPanel';

const propTypes = {
  actionSendMessage: PropTypes.func.isRequired,

  actionAddUserIdToMembers: PropTypes.func.isRequired,
  actionChangeUserStatusToOnline: PropTypes.func.isRequired,
  actionGetMemberSubscription: PropTypes.func.isRequired,
  actionGetRoomSubscription: PropTypes.func.isRequired,
  actionInviteMember: PropTypes.func.isRequired,
  // actionLoadRoom: PropTypes.func.isRequired,
  actionToggleInviteMember: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  isInvitingMember: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  emailsInvited: PropTypes.arrayOf(PropTypes.string),
  memberUserIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  roomId: PropTypes.string.isRequired,
  roomName: PropTypes.string.isRequired,
  roomPathname: PropTypes.string.isRequired,
  userEmail: PropTypes.string,
  userId: PropTypes.string,
  userName: PropTypes.string,
};

const defaultProps = {
  emailsInvited: [],
  userEmail: '',
  userId: '',
  userName: '',
};

const mapStateToProps = state => ({
  error: state.room.error,
  isInvitingMember: state.room.isInvitingMember,
  isLoading: state.room.isLoading,
  emailsInvited: state.room.emailsInvited,
  memberUserIds: getMemberIds(state),
  roomId: state.room.id,
  roomName: state.room.name,
  roomPathname: state.room.pathname,
  userEmail: state.user.email,
  userId: state.user.id,
  userName: state.user.name,
});

const mapDispatchToProps = dispatch => ({
  actionAddUserIdToMembers: (roomId, userId) => dispatch(addUserIdToMembers(roomId, userId)),
  actionChangeUserStatusToOnline: (roomId, userId) =>
    dispatch(changeUserStatusToOnline(roomId, userId)),
  actionGetMemberSubscription: roomId => dispatch(getMemberSubscription(roomId)),
  actionGetRoomSubscription: pathname => dispatch(getRoomSubscription(pathname)),
  actionInviteMember: (email, inviterName, roomId, roomName, roomPathname) =>
    dispatch(inviteMember(email, inviterName, roomId, roomName, roomPathname)),
  actionToggleInviteMember: () => dispatch(toggleInviteMember()),

  actionSendMessage: (message, tags) => dispatch(sendMessage(message, tags)),
});

class Room extends React.Component {
  state = {
    hasRoomAccess: false,
    hasLoadedMembers: false,
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
    // if the room has loaded + there is a userID + has not loaded members
    const { hasLoadedMembers } = this.state;
    const { actionChangeUserStatusToOnline, memberUserIds, roomId, roomName, userId } = this.props;
    // console.log('roomId userId', roomId, userId);
    if (!hasLoadedMembers && memberUserIds.length > 0 && roomId && userId) {
      this.loadMembers();
      actionChangeUserStatusToOnline(roomId, userId);
    }
    if (!prevProps.roomName && roomName) {
      mixpanel.track('Visited Room', { id: roomId, name: roomName });
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
    actionInviteMember(email, userName, roomId, roomName, roomPathname);
    mixpanel.track('Invited Teammate', { roomId });
  };

  loadRoom = async pathname => {
    await this.subscribeRoom(pathname);
  };

  loadMembers = () => {
    const { emailsInvited, memberUserIds, roomId, userEmail, userId } = this.props;
    if (memberUserIds.indexOf(userId) > -1) {
      this.subscribeMembers(memberUserIds);
      this.setState({ hasRoomAccess: true });
    } else if (emailsInvited.indexOf(userEmail) > -1) {
      this.subscribeMembers([...memberUserIds, userId]);
      this.addEmailInvitedToMemberUserIds(roomId);
      this.setState({ hasRoomAccess: true });
    }
    this.setState({ hasLoadedMembers: true });
  };

  subscribeRoom = async pathname => {
    const { subscriptions } = this.state;
    const { actionGetRoomSubscription } = this.props;
    const newSub = await actionGetRoomSubscription(pathname);
    const subscriptionsUpdated = [...subscriptions, newSub];
    this.setState({ subscriptions: subscriptionsUpdated });
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
    const { actionSendMessage } = this.props;
    const testMsg = {
      content: 'hello world',
      hasAttachment: false,
      roomId: 'abc',
      savesByUserId: [],
      seenByUserId: ['xyz'],
      senderUserId: 'xyz',
    };

    return (
      <Wrapper>
        <button onClick={() => actionSendMessage(testMsg)}>Click To Test</button>
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
