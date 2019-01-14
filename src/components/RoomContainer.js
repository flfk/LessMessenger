import styled from 'styled-components';

import Media from '../utils/Media';

const RoomContainer = styled.div`
  display: flex;
  flex: 1;
  margin: auto;
  width: 100%;

  ${Media.tablet} {
    width: auto;
    margin: 0;
  }
`;

export default RoomContainer;
