/* eslint-disable prettier/prettier */
import React from 'react';
import {Text} from 'react-native';
import styled from 'styled-components';

const Container = styled.View`
  flex: 1;
  color: purple;
`;
const Myzone = styled.View`
  flex: 1;
  background-color: white;
  align-items: center;
  justify-content: center;
`;
const Playlist = styled.View`
  flex: 3;
  background-color: skyblue;
`;
const Friendlist = styled.View`
  flex: 2;
  background-color: tomato;
`;

const Home = () => {
  return (
    <Container>
      <Myzone>
        <Text>MY ZONE</Text>
      </Myzone>
      <Playlist>
        <Text>친구들의 추천</Text>
      </Playlist>
      <Friendlist>
        <Text>오늘의 친구 추천</Text>
      </Friendlist>
    </Container>
  );
};

export default Home;
