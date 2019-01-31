import styled from 'styled-components';

import Media from '../../utils/Media';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  margin: auto;
  width: 100%;
  max-width: 880px;

  ${Media.tablet} {
    width: auto;
    margin: 0;
  }
`;

export default Wrapper;
