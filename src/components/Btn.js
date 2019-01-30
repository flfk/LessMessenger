import styled from 'styled-components';

import Colors from '../utils/Colors';
import Darken from '../utils/Darken';
import Media from '../utils/Media';

// Default is secondary, for primary button use <Btn primary></Btn>

const Btn = styled.button`
  flex: 1 0 1;
  width: 100%;
  width: ${props => (props.narrow ? '96px' : '')};
  padding: ${props => (props.short ? '0.5em 0.5em' : '1em 1em')};
  background-color: transparent;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  border: 1px solid ${Colors.primary.green};
  background-color: ${props => (props.primary ? Colors.primary.green : 'none')};
  color: ${props => (props.primary ? 'white' : Colors.primary.green)};

  :hover {
    border-color: ${props => (props.primary ? Darken(Colors.primary.green) : Colors.primary.green)};
    background-color: ${props =>
      props.primary ? Darken(Colors.primary.green) : Colors.primary.green};
    color: white;
  }

  :focus {
    outline: none;
  }

  ${Media.tablet} {
    font-size: 14px;
  }

  // Animation for hover, source: Bootstrap 4
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
`;

const Tertiary = styled.button`
  padding: 0.5em 0.5em;
  width: ${props => (props.narrow ? '96px' : '')};
  font-size: 16px;
  font-weight: bold;
  background-color: transparent;
  border: none;
  color: ${Colors.primary.red};
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
  }

  ${Media.tablet} {
    font-size: 14px;
  }

  ${props => (props.noPadding ? 'padding: 0' : '')};
`;

const Inline = styled(Tertiary)`
  font-size: 24px;
`;

const Full = styled(Btn)`
  width: 100%;
  margin: 0;
`;

const Profile = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: none;
  // font-size: 16px;
  // font-weight: bold;
  width: 100%;
  color: ${Colors.primary.red};
  cursor: pointer;
  :focus {
    outline: none;
  }
`;

Btn.Tertiary = Tertiary;
Btn.Full = Full;
Btn.Inline = Inline;
Btn.Profile = Profile;

export default Btn;
