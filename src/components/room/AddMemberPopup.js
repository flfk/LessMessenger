import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import validator from 'validator';

// import Fonts from '../../utils/Fonts';
import Btn from '../Btn';
import Content from '../Content';
import InputText from '../InputText';
import Popup from '../Popup';

const propTypes = {
  handleClose: PropTypes.func.isRequired,
};

const defaultProps = {};

class AddMemberPopup extends React.Component {
  state = {
    inviteeEmail: '',
    inviteeEmailErrMsg: '',
    inviteeEmailIsValid: false,
  };

  handleBlur = field => () => {
    let isValid = false;
    if (field === 'inviteeEmail') isValid = this.isInviteeEmailValid();
    const validFieldId = `${field}IsValid`;
    this.setState({ [validFieldId]: isValid });
  };

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

  handleInvite = () => {
    if (this.isInviteeEmailValid()) {
      console.log('XX TODO HANDLE INVITE');
    }
  };

  isInviteeEmailValid = () => {
    const { inviteeEmail } = this.state;
    if (!validator.isEmail(inviteeEmail)) {
      this.setState({ inviteeEmailErrMsg: 'Valid Email address required.' });
      return false;
    }
    this.setState({ inviteeEmailErrMsg: '', inviteeEmailIsValid: true });
    return true;
  };

  render() {
    const { inviteeEmail, inviteeEmailErrMsg, inviteeEmailIsValid } = this.state;
    const { handleClose } = this.props;

    return (
      <div>
        <Popup.Background />
        <Popup.Card>
          <Content.Spacing16px />
          <Popup.BtnClose handleClose={handleClose} />
          <TextWrapper>
            <InputText
              errMsg={inviteeEmailErrMsg}
              label="What's your teammate's email?"
              placeholder="Teammate's email"
              onBlur={this.handleBlur('inviteeEmail')}
              onChange={this.handleChangeInput('inviteeEmail')}
              value={inviteeEmail}
              isValid={inviteeEmailIsValid}
            />
            <Btn primary onClick={this.handleInvite}>
              Send Invitation
            </Btn>
          </TextWrapper>
        </Popup.Card>
      </div>
    );
  }
}

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  margin: auto;
  margin-top: 32px;

  align-items: ${props => (props.isCentered ? 'center' : '')};
`;

AddMemberPopup.propTypes = propTypes;
AddMemberPopup.defaultProps = defaultProps;

export default AddMemberPopup;
