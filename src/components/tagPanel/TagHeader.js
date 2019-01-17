import styled from 'styled-components';

import Colors from '../../utils/Colors';

const TagHeader = styled.div`
  font-size: 16px;
  color: white;
  opacity: ${props => (props.isSelected ? '0.8' : '0.54')};
  font-weight: ${props => (props.isSelected ? '600' : '400')};
`;

export default TagHeader;
