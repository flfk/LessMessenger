import styled from 'styled-components';

import Media from '../../utils/Media';

const Container = styled.div`
  border: 1px solid green;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  align-content: flex-end;
  margin: auto;
  height: 100%;

  > div:focus {
    outline: none;
  }

  ${Media.tablet} {
    width: auto;
    margin: 0;
  }
`;

export default Container;
