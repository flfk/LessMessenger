import styled from 'styled-components';

import Media from '../../utils/Media';

const WrapperTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 72px;
  width: 680px;
  margin-bottom: 32px;
`;

const Btns = styled.div`
  width: 100%;
  display: flex;
  input[type='text'] {
    flex: 1 1 auto;
  }

  ${Media.tablet} {
    flex-direction: column;

    input[type='text'] {
      margin-bottom: 8px;
    }
  }
`;

WrapperTitle.Btns = Btns;

export default WrapperTitle;
