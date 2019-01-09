import styled from 'styled-components';

import Colors from '../utils/Colors';

const NavBarDropdown = styled.div`
  position: absolute;
  top: 50px;
  right: 50px;
  width: 160px;
  background-color: white;
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.2);

  button {
    border: none;
    border-radius: 0;
    transition: none;

    :hover {
      color: white;
      text-decoration: none;
      background-color: ${Colors.primary.red};
    }
  }
`;

export default NavBarDropdown;
