import styled from 'styled-components';

import Media from '../utils/Media';

const RoomContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: auto;
  padding-left: 48px;
  padding-right: 48px;

  ${Media.tablet} {
    width: auto;
    margin: 0;
  }
`;

export default RoomContainer;
