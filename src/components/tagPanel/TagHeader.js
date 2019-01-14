import styled from 'styled-components';

import Colors from '../../utils/Colors';

const TagHeader = styled.div`
  font-size: 16px;
  color: ${props => (props.isSelected ? Colors.greys.primary : Colors.greys.supporting)};
  font-weight: ${props => (props.isSelected ? '600' : '400')};
`;

export default TagHeader;
