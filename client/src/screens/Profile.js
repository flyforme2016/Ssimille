/* eslint-disable prettier/prettier */
import React from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';

const Profile = () => {
  return (
    <Container>
      <Profilcecontainer>
        <Box1>
          <Text>닉네임변경</Text>
        </Box1>
        <Box1>
          <Text>프로필뮤직 변경</Text>
        </Box1>
        <Box1>
          <Text>게시물</Text>
          <Text>친구</Text>
          <Text>애청곡</Text>
        </Box1>
      </Profilcecontainer>
      <Box2 />
    </Container>
  );
};

const Container = styled.ScrollView`
  flex: 1;
  background-color: lightgrey;
`;
const Profilcecontainer = styled.View`
  flex: 2;
`;
const Box1 = styled.View`
  flex: 1;
  background-color: tomato;
  border: 2px solid black;
`;
const Box2 = styled.View`
  flex: 4;
  background-color: skyblue;
  border: 2px solid black;
`;

export default Profile;
