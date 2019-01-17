import styled from 'styled-components';

import Colors from '../../utils/Colors';

const PanelContainer = styled.div`
  display: flex;
  height: 100%;
  min-height: 100%;
  flex-direction: column;
  background-color: ${Colors.background.primary};
`;

export default PanelContainer;
