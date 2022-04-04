/* eslint-disable prettier/prettier */
import React from 'react';
import {Text} from 'react-native';
import styled from 'styled-components';

const Container = styled.View`
  flex: 1;
  color: purple;
`;
const Chatlist = styled.View`
  flex: 1;
`;
const Box = styled.View`
  flex: 0.2;
  background-color: skyblue;
  border: 2px solid black;
`;

const Chatroom = ({navigation}) => {
  return (
    <Container>
      <Chatlist>
        <Text>대화목록</Text>
        <Box />
        <Box />
      </Chatlist>
    </Container>
  );
};

export default Chatroom;
