import styled from 'styled-components';

import Colors from '../../utils/Colors';

const TagHeader = styled.div`
  font-size: 16px;
  color: ${props => (props.color ? props.color : 'white')};
  opacity: ${props => (props.isSelected ? '1' : '0.54')};
  font-weight: ${props => (props.isSelected ? '600' : '400')};
`;

export default TagHeader;
