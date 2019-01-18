import styled from 'styled-components';

import Colors from '../../utils/Colors';

const NavBarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 72px;
  background-color: ${Colors.background.secondary};
  border-bottom: 1px solid ${Colors.background.supporting};
`;

export default NavBarWrapper;
