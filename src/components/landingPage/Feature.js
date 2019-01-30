import styled from 'styled-components';

const Feature = styled.div``;

const Wrapper = styled.div`
  display: flex;

  > div:first-child {
    margin-right: 40px;
  }
`;

Feature.Wrapper = Wrapper;

export default Feature;
