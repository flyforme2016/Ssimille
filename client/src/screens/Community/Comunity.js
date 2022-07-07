import React from 'react';
import styled from 'styled-components/native';
import CommunityTabBar from './CommunityTabBar';
import SpotifyTab from '../../components/SpotifyTab';

const Community = ({navigation: {push}}) => {
  return (
    <>
      <Container>
        <CommunityTabBar />
      </Container>
      <UploadBtn onPress={() => push('Stack', {screen: 'CommunityUpload'})}>
        <BtnText>+</BtnText>
      </UploadBtn>
      <SpotifyTab />
    </>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const UploadBtn = styled.TouchableOpacity`
  width: 50;
  height: 50;
  border-radius: 25px;
  background-color: #b7b4df;
  position: absolute;
  z-index: 1;
  right: 10;
  bottom: 60;
  justify-content: center;
  align-items: center;
  elevation: 5;
`;
const BtnText = styled.Text`
  font-size: 30px;
  color: white;
`;

export default Community;
