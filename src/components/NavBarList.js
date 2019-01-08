import styled from 'styled-components';
import COLORS from '../utils/Colors';

const NavBar = styled.ul`
  flex: 0 1 600px;

  display: flex;
  align-items: center;

  margin: 0;
  padding: 0 8px;

  // logo
  li:first-child {
    margin-right: auto;
  }

  // navLinks
  li {
    list-style: none;
  }

  li:not(:first-child) {

    a {
      height: 100%;
      color: ${COLORS.greys.primary};
      font-weight: bold;
      font-size: 12px;
      text-decoration: none;
      white-space: nowrap;
  }
`;
export default NavBar;
