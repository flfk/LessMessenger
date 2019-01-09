// import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Content from '../components/Content';
import ErrorScreen from '../components/ErrorScreen';
import { getPathname } from '../utils/Helpers';
import MessageInput from './MessageInput';
import Messages from './Messages';
import { loadRoom } from '../data/room/room.actions';
import Spinner from '../components/Spinner';

const propTypes = {
  actionLoadRoom: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
};

const defaultProps = {};

const mapStateToProps = state => ({
  error: state.room.error,
  isLoading: state.room.isLoading,
  name: state.room.name,
  pathname: state.room.pathname,
});

const mapDispatchToProps = dispatch => ({
  actionLoadRoom: pathname => dispatch(loadRoom(pathname)),
});

class Room extends React.Component {
  componentDidMount() {
    const pathname = getPathname(this.props);
    console.log('pathname', pathname);
    if (pathname) {
      const { actionLoadRoom } = this.props;
      actionLoadRoom(pathname);
    }

    // const { actionLoadMessages } = this.props;
    // actionLoadMessages();
  }

  render() {
    const { error, isLoading, name, pathname } = this.props;

    if (error) return <ErrorScreen />;

    if (isLoading) return <Spinner />;

    return (
      <Content>
        <h1>name: {name} </h1>
        <h1>pathname: {pathname}</h1>
        <Messages />
        <MessageInput />
      </Content>
    );
  }
}

Room.propTypes = propTypes;
Room.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Room);
