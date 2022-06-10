import React from 'react';
import styled from 'styled-components/native';
import SpotifyTab from '../components/SpotifyTab';

const Notice = () => {
  return (
    <>
      <Container>
        <NoticeText>Notice</NoticeText>
      </Container>
      <SpotifyTab />
    </>
  );
};

const Container = styled.View`
  background-color: #ffffff;
`;
const NoticeText = styled.Text`
  font-size: 12px;
`;
export default Notice;
