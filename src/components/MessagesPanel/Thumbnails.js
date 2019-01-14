import styled from 'styled-components';

const Container = styled.div`
  padding-bottom: 16px;
  padding-left: 56px;
  padding-right: 56px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const File = styled.div`
  height: 96px;
  width: 96px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

const Img = styled(File)`
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
