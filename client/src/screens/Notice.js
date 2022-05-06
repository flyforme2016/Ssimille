/* eslint-disable prettier/prettier */
import React from 'react';
import Styled from 'styled-components/native';

const Notice = () => {
  return (
    <Container>
      <Label>Notice</Label>
    </Container>
  );
};

const Container = Styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const Label = Styled.Text`
    font-size: 24px;
`;

export default Notice;
