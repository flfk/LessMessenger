import styled from 'styled-components';

import Colors from '../../utils/Colors';
import Media from '../../utils/Media';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  align-content: flex-end;
  margin: auto;
  height: 100%;

  background-color: ${Colors.background.primary};

  > div:focus {
    outline: none;
  }

  ${Media.tablet} {
    width: auto;
    margin: 0;
  }
`;

export default Container;
