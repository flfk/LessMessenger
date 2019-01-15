import styled from 'styled-components';

import Colors from '../../utils/Colors';

const Wrapper = styled.div`
  border-right: ${`1px solid ${Colors.greys.supporting}`};
  flex-basis: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: auto;
`;

export default Wrapper;
