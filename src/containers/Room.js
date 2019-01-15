// import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import ErrorScreen from '../components/ErrorScreen';
import { getPathname } from '../utils/Helpers';
import MessagesPanel from './MessagesPanel';
import { loadRoom } from '../data/room/room.actions';
import RoomContainer from '../components/RoomContainer';
import Spinner from '../components/Spinner';
import SignUp from './SignUp';
import TagPanel from './TagPanel';

const propTypes = {
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
  actionLoadRoom: pathname => dispatch(loadRoom(pathname)),
});

class Room extends React.Component {
  state = {
    toLandingPage: false,
  };

  componentDidMount() {
    const pathname = getPathname(this.props);
    if (pathname) {
      const { actionLoadRoom } = this.props;
      actionLoadRoom(pathname);
    } else {
      this.setState({ toLandingPage: true });
    }
  }

  goToLandingPage = () => (
    <Redirect
      push
      to={{
        pathname: '/home',
      }}
    />
  );

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
