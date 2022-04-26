/* eslint-disable prettier/prettier */
import React from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  color: purple;
`;
const Box1 = styled.View`
  flex: 1;
  background-color: tomato;
  border: 2px solid black;
`;
const Box2 = styled.View`
  flex: 3;
  background-color: skyblue;
  border: 2px solid black;
`;

const Community = () => {
  return (
    <Container>
      <Box1>
        <Text>카테고리</Text>
      </Box1>
      <Box2 />
    </Container>
  );
};

export default Community;
