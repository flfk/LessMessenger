import styled from 'styled-components';

import Img from '../../assets/BackgroundImg.png';

const TitleImg = styled.div`
  width: 1080px;
  height: 400px;
  background-image: url(${Img});
  background-size: cover;
  position: absolute;
  top: 0px;
  left: 50%;
  margin-left: -568px;
`;

export default TitleImg;
