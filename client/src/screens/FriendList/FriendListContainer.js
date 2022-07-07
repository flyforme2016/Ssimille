import React from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import SpotifyTab from '../../components/SpotifyTab';
import FriendListTabBar from './FriendListTabBar';

const FriendListContainer = ({route}) => {
  const {kakaoUid} = useSelector(state => state.kakaoUid);

  return (
    <>
      <Container>
        <FriendListTabBar
          paramsKey={route.params ? route.params.userId : kakaoUid}
          listType={route.params ? route.params.listType : null}
        />
      </Container>
      <SpotifyTab />
    </>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;
export default FriendListContainer;
