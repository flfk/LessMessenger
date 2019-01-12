import styled from 'styled-components';

import Media from '../../utils/Media';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 1000px;
  margin: auto;
  padding-left: 16px;
  padding-right: 16px;

  > div:focus {
    outline: none;
  }

  ${Media.tablet} {
    width: auto;
    margin: 0;
  }
`;

export default Container;
