import React from 'react';
import styled from 'styled-components/native';
import SpotifyTab from '../../components/SpotifyTab';
import FriendListTabBar from './FriendListTabBar';
const FriendList = () => {
  return (
    <>
      <Container>
        <FriendListTabBar />
      </Container>
      {/* <SpotifyTab /> */}
    </>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;
export default FriendList;
