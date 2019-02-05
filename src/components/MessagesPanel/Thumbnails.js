import styled from 'styled-components';

import Colors from '../../utils/Colors';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const File = styled.div`
  border: 1px solid ${Colors.greys.tertiary};
  padding-left: 16px;
  padding-right: 16px;
  height: 56px;
  width: 96px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
  margin-bottom: 16px;
`;

const Img = styled(File)`
  height: 96px;
  width: 96px;
  padding: 0;
  border-radius: 10px;
  background-image: url(${props => props.src});
  background-size: cover;
`;

const ImgWrapper = styled.div`
  display: flex;
  margin-right: 16px;
`;

const Thumbnail = {};
Thumbnail.Container = Container;
Thumbnail.File = File;
Thumbnail.Img = Img;
Thumbnail.ImgWrapper = ImgWrapper;

export default Thumbnail;
