import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { Provider } from 'react-redux';
import mixpanel from 'mixpanel-browser';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import store from './data/Store';
import Main from './components/Main';

import LandingPage from './containers/LandingPage';
import NavBar from './containers/NavBar';
import Room from './containers/Room';

class App extends Component {
  constructor(props) {
    super(props);
    this.initAnalaytics();
  }

  initAnalaytics = () => {
    if (process.env.NODE_ENV === 'development') {
      mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN_DEV);
      mixpanel.identify();
    } else {
      this.initGoogleAnalytics(process.env.REACT_APP_GOOGLE_ANALYTICS_TOKEN);
      mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN_PROD);
      mixpanel.identify();
    }
  };

  initGoogleAnalytics = token => {
    ReactGA.initialize(token);
    ReactGA.pageview(window.location.pathname + window.location.search);
  };

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Main>
            <NavBar />
            <Switch>
              <Route path="/home" component={LandingPage} />
              <Route path="/" component={Room} />
            </Switch>
          </Main>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
