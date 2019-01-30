import styled from 'styled-components';

import Media from '../../utils/Media';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 800px;
  margin: auto;
  padding-left: 16px;
  padding-right: 16px;

  ${Media.tablet} {
    width: auto;
    margin: 0;
  }
`;

export default Content;
