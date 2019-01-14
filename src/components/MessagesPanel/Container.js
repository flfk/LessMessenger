import styled from 'styled-components';

import Media from '../../utils/Media';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: auto;

  > div:focus {
    outline: none;
  }

  ${Media.tablet} {
    width: auto;
    margin: 0;
  }
`;

export default Container;
