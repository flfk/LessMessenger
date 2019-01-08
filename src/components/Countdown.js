import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Fonts from '../utils/Fonts';

const propTypes = {
  date: PropTypes.number.isRequired,
  small: PropTypes.bool,
};

const defaultProps = {
  small: false,
};

const INTERVAL_IN_MILLIS = 1000;

class Countdown extends React.Component {
  state = {
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  };

  componentDidMount() {
    const { date } = this.props;
    this.start(date);
  }

  componentDidUpdate(prevProps) {
    const { date } = this.props;
    if (date !== prevProps.date) {
      this.start(date);
    }
  }

  componentWillUnmount() {
    this.stop();
  }

  calculateCountdown = endDate => {
    let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;

    // clear countdown when date is reached
    if (diff <= 0) return false;

    const timeLeft = {
      years: 0,
      days: 0,
      hours: 0,
      mins: 0,
      secs: 0,
      millisecs: 0,
    };

    // calculate time difference between now and expected date
    if (diff >= 365.25 * 86400) {
      // 365.25 * 24 * 60 * 60
      timeLeft.years = Math.floor(diff / (365.25 * 86400));
      diff -= timeLeft.years * 365.25 * 86400;
    }
    if (diff >= 86400) {
      // 24 * 60 * 60
      timeLeft.days = Math.floor(diff / 86400);
      diff -= timeLeft.days * 86400;
    }
    if (diff >= 3600) {
      // 60 * 60
      timeLeft.hours = Math.floor(diff / 3600);
      diff -= timeLeft.hours * 3600;
    }
    if (diff >= 60) {
      timeLeft.mins = Math.floor(diff / 60);
      diff -= timeLeft.mins * 60;
    }
    timeLeft.secs = diff;

    return timeLeft;
  };

  start = date => {
    this.interval = setInterval(() => {
      const timeLeft = this.calculateCountdown(date);
      if (timeLeft) {
        this.setState({ ...timeLeft });
      } else {
        this.stop();
      }
    }, INTERVAL_IN_MILLIS);
  };

  stop = () => {
    clearInterval(this.interval);
  };

  addLeadingZeros = value => {
    let valueUpdated = String(value);
    while (valueUpdated.length < 2) {
      valueUpdated = `0${valueUpdated}`;
    }
    return valueUpdated;
  };

  render() {
    const { days, hours, mins, secs } = this.state;
    const { small } = this.props;

    const text = small
      ? { days: 'd', hours: 'h', mins: 'm', secs: 's' }
      : { days: 'Days', hours: 'Hours', mins: 'Mins', secs: 'Secs' };

    return (
      <Container small={small}>
        <Unit small={small}>
          <H1 noMarginTop small={small}>
            {this.addLeadingZeros(days)}
          </H1>
          <Fonts.P>{text.days}</Fonts.P>
        </Unit>

        <Unit small={small}>
          <H1 noMarginTop small={small}>
            {this.addLeadingZeros(hours)}
          </H1>
          <Fonts.P>{text.hours}</Fonts.P>
        </Unit>

        <Unit small={small}>
          <H1 noMarginTop small={small}>
            {this.addLeadingZeros(mins)}
          </H1>
          <Fonts.P>{text.mins}</Fonts.P>
        </Unit>

        <Unit small={small}>
          <H1 noMarginTop small={small}>
            {this.addLeadingZeros(secs)}
          </H1>
          <Fonts.P>{text.secs}</Fonts.P>
        </Unit>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: ${props => (props.small ? 'center' : 'space-around')};
  margin-right: ${props => (props.small ? '4px' : '')};
  height: ${props => (props.small ? '16px' : '')};
`;

const H1 = styled(Fonts.H1)`
  margin-bottom: 4px;
  font-size: ${props => (props.small ? '14px' : '')};
  margin: ${props => (props.small ? '0' : '')};
  margin-right: ${props => (props.small ? '4px' : '')};
  margin-left: ${props => (props.small ? '4px' : '')};
`;

const Unit = styled.div`
  display: ${props => (props.small ? 'flex' : '')};
  align-items: flex-end;
`;

Countdown.propTypes = propTypes;

Countdown.defaultProps = defaultProps;

export default Countdown;
