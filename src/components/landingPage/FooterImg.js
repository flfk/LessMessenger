import styled from 'styled-components';

import Img from '../../assets/FooterImg.png';

const FooterImg = styled.div`
  align-self: flex-end;
  width: 80px;
  height: 128px;
  background-image: url(${Img});
  background-size: cover;
`;

export default FooterImg;
