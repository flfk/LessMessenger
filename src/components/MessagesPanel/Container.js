import styled from 'styled-components';

import Media from '../../utils/Media';

const RoomContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 600px;
  margin: auto;
  padding-left: 16px;
  padding-right: 16px;

  ${Media.tablet} {
    width: auto;
    margin: 0;
  }
`;

export default RoomContainer;
