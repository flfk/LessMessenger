import styled from 'styled-components';

import Colors from '../../utils/Colors';

const TagItem = styled.button`
  border: 1px solid blue;
  padding: 8px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  :focus {
    outline: none;
  }
  cursor: pointer;
  border: none;
`;

export default TagItem;
