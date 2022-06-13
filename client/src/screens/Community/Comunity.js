import React from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommunityTabBar from './CommunityTabBar';
import SpotifyTab from '../../components/SpotifyTab';

const Community = ({navigation: {navigate}}) => {
  return (
    <>
      <Container>
        <NavBar>
          <NavText>Community</NavText>
          <UploadBtn
            onPress={() => navigate('Stack', {screen: 'CommunityUpload'})}>
            <Ionicons name="duplicate" size={35} color="#b7b4df" />
          </UploadBtn>
        </NavBar>
        <NavDivider />
        <CommunityTabBar />
      </Container>
      {/* <SpotifyTab /> */}
    </>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const NavDivider = styled.View`
  border-bottom-color: gray;
  border-bottom-width: 1px;
  width: 90%;
  align-self: center;
`;
const NavBar = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const NavText = styled.Text`
  color: #9b59b6;
  font-size: 24;
  padding: 10px;
`;
const UploadBtn = styled.TouchableOpacity`
  width: 60;
  position: relative;
`;

export default Community;
