import styled from 'styled-components';

const Scrollable = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 100%;
  overflow-y: auto;

  // background-color: green;

  ${props =>
    props.alignBottom
      ? 'display: flex; flex-direction: column; > div:first-child { margin-top: auto !important;}'
      : ''}
`;

export default Scrollable;
