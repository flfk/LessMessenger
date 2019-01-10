import styled from 'styled-components';

import Colors from '../../utils/Colors';

const Container = styled.div`
  border: 1px solid blue;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const File = styled.div`
  border: 1px solid orange;
  height: 96px;
  width: 96px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

const Img = styled(File)`
  border: 1px solid orange;
  height: 96px;
  width: 96px;
  border-radius: 10px;
  background-image: url(${props => props.src});
  background-size: cover;
`;

const Thumbnail = {};
Thumbnail.Container = Container;
Thumbnail.File = File;
Thumbnail.Img = Img;

export default Thumbnail;
