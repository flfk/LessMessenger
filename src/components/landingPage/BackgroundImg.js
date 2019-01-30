import styled from 'styled-components';

import Img from '../../assets/BackgroundImg.png';

const TitleImg = styled.div`
  width: 800px;
  height: 240px;
  background-image: url(${Img});
  background-size: cover;
  position: absolute;
  top: 0px;
  left: 50%;
  margin-left: -400px;
`;

export default TitleImg;
