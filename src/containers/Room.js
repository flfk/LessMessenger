// import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import ErrorScreen from '../components/ErrorScreen';
import { getPathname } from '../utils/Helpers';
import MessageInput from './MessageInput';
import Messages from './Messages';
import { loadRoom } from '../data/room/room.actions';
import RoomContainer from '../components/RoomContainer';
import Spinner from '../components/Spinner';

const propTypes = {
  actionLoadRoom: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  userID: PropTypes.string.isRequired,
};

const defaultProps = {};

const mapStateToProps = state => ({
  error: state.room.error,
  isLoading: state.room.isLoading,
  name: state.room.name,
  pathname: state.room.pathname,
  userID: state.user.id,
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
    const { error, isLoading, name, pathname, userID } = this.props;

    if (toLandingPage) return this.goToLandingPage();

    if (error) return <ErrorScreen />;

    if (isLoading) return <Spinner />;

    return (
      <RoomContainer>
        <Messages />
        <MessageInput />
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
