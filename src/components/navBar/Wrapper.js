import styled from 'styled-components';

import Colors from '../../utils/Colors';

const NavBarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  background-color: #fafafa;
  border-bottom: 1px solid ${Colors.greys.light};
`;

export default NavBarWrapper;
