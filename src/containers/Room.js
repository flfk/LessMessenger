// import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Tinycon from 'tinycon';

import ErrorScreen from '../components/ErrorScreen';
import { getPathname } from '../utils/Helpers';
import MessagesPanel from './MessagesPanel';
import { getMemberSubscription } from '../data/members/members.actions';
import { loadRoom } from '../data/room/room.actions';
import RoomContainer from '../components/RoomContainer';
import Spinner from '../components/Spinner';
import SignUp from './SignUp';
import TagPanel from './TagPanel';

const propTypes = {
  actionGetMemberSubscription: PropTypes.func.isRequired,
  actionLoadRoom: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  memberUserIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  userId: PropTypes.string,
};

const defaultProps = {
  userId: '',
};

const mapStateToProps = state => ({
  error: state.room.error,
  isLoading: state.room.isLoading,
  memberUserIds: state.room.memberUserIds,
  userId: state.user.id,
});

const mapDispatchToProps = dispatch => ({
  actionGetMemberSubscription: roomId => dispatch(getMemberSubscription(roomId)),
  actionLoadRoom: pathname => dispatch(loadRoom(pathname)),
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

  componentDidUpdate() {
    this.handleFaviconAlert();
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
    this.subscribeMembers(room.memberUserIds);
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
    const { error, isLoading, memberUserIds, userId } = this.props;

    if (toLandingPage) return this.goToLandingPage();

    if (error) return <ErrorScreen />;

    if (isLoading) return <Spinner />;

    if (!userId) return <SignUp />;

    const hasRoomAccess = memberUserIds.indexOf(userId) > -1;
    if (!hasRoomAccess)
      return (
        <div>
          Oops, looks like you don't have access to this room. Contact your room administrator to
          request an invitation.
        </div>
      );

    return (
      <RoomContainer>
        <TagPanel />
        <MessagesPanel />
      </RoomContainer>
    );
  }
}

Room.propTypes = propTypes;
Room.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Room);
