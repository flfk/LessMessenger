import styled from 'styled-components';

const TagItem = styled.button`
  padding: 8px;
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: transparent;

  :focus {
    outline: none;
  }
  cursor: pointer;
  border: none;
`;

export default TagItem;
