import styled from 'styled-components';

import Colors from '../../utils/Colors';

const Wrapper = styled.div`
  flex-basis: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: auto;
  background-color: ${Colors.background.secondary};
  border-right: 1px solid ${Colors.background.supporting};
`;

export default Wrapper;
