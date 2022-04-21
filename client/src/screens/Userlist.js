/* eslint-disable prettier/prettier */
import React from 'react';
import {Text} from 'react-native';
import styled from 'styled-components';

const Container = styled.View`
  flex: 1;
  color: purple;
`;
const Friendlist = styled.View`
  flex: 1;
`;
const Box = styled.View`
  flex: 0.2;
  background-color: skyblue;
  border: 2px solid black;
`;

const Userlist = () => {
  return (
    <Container>
      <Friendlist>
        <Text>친구목록</Text>
        <Box />
        <Box />
      </Friendlist>
    </Container>
  );
};

export default Userlist;
