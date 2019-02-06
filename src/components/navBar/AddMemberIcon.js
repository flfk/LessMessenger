import React from 'react';
import styled from 'styled-components';

import { MdAddCircleOutline } from 'react-icons/md';

const Wrapper = styled.div`
  font-size: 20px;
`;

const AddMemberIcon = () => (
  <Wrapper>
    <MdAddCircleOutline />
  </Wrapper>
);

export default AddMemberIcon;
