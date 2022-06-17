import React from 'react';
import styled from 'styled-components/native';
import ProfileTabBar from './ProfileTapBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SpotifyTab from '../../components/SpotifyTab';
import {useSelector} from 'react-redux';
import {remote} from 'react-native-spotify-remote';
import getSpotifyToken from '../../api/getSpotifyToken';

const Profile = ({navigation}) => {
  const {myProfileData} = useSelector(state => state.myProfile);
  const HashTag = [
    myProfileData.tag1_cd,
    myProfileData.tag2_cd,
    myProfileData.tag3_cd,
    myProfileData.tag4_cd,
    myProfileData.tag5_cd,
  ].filter(tag => tag !== null);

  return (
    <>
      <Container>
        <NavBar>
          <NavText>PROFILE</NavText>
          <Btn
            onPress={() =>
              navigation.navigate('Stack', {
                screen: 'ProfileEdit',
                params: {
                  profileImg: myProfileData.profile_image,
                  nicknmae: myProfileData.nickname,
                  hashTag: HashTag,
                  profileMusic: myProfileData.profile_music_uri,
                },
              })
            }>
            <Ionicons name="settings-outline" size={35} />
          </Btn>
        </NavBar>
        <Divider />

        <ProfileContainer>
          <UserInfo>
            <ProfilePic source={{uri: myProfileData.profile_image}} />
            <UserName>{myProfileData.nickname}</UserName>
          </UserInfo>
          <ProfileInfo>
            <CountContainer>
              <CountView>
                <CountText>POST</CountText>
                <CountText>{myProfileData.post_count}</CountText>
              </CountView>
              <CountView>
                <CountText>FREIND</CountText>
                <CountText>{myProfileData.friend_count}</CountText>
              </CountView>
              <CountView>
                <CountText>SONG</CountText>
                <CountText>{myProfileData.song_count}</CountText>
              </CountView>
            </CountContainer>

            <TagContainer>
              {HashTag.map(data => {
                return (
                  <TagBtn>
                    <TagText>{data}</TagText>
                  </TagBtn>
                );
              })}
            </TagContainer>
          </ProfileInfo>
        </ProfileContainer>
        <MusicContainer>
          <MusicPlayBtn
            onPress={async () => {
              console.log('clicked');
              await getSpotifyToken();
              await remote.playUri(myProfileData.profile_music_uri);
            }}>
            <ProfileMusic>
              {myProfileData.album_title} - {myProfileData.album_artist_name}
            </ProfileMusic>
          </MusicPlayBtn>
        </MusicContainer>

        <ProfileTabBar />
      </Container>
      <SpotifyTab />
    </>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const Divider = styled.View`
  border-bottom-color: gray;
  border-bottom-width: 1px;
  width: 90%;
  align-self: center;
  elevation: 3;
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
const Btn = styled.TouchableOpacity`
  width: 60px;
  position: absolute;
  right: -1px;
`;
const ProfileContainer = styled.View`
  margin: 12px;
  flex-direction: row;
`;
const UserInfo = styled.View`
  margin: 6px 12px;
  align-items: center;
`;

const ProfilePic = styled.Image`
  width: 100;
  height: 100;
  border-radius: 50;
`;
const UserName = styled.Text`
  font-size: 16px;
  margin: 8px;
`;
const CountContainer = styled.View`
  margin: 6px;
  flex-direction: row;
`;
const CountView = styled.View`
  align-items: center;
`;
const CountText = styled.Text`
  font-weight: bold;
  font-size: 14;
  margin: 8px;
`;
const ProfileInfo = styled.View`
  justify-content: center;
`;
const TagContainer = styled.View`
  justify-content: center;
  flex-direction: row;
`;
const TagBtn = styled.TouchableOpacity`
  padding: 0 4px;
`;
const TagText = styled.Text`
  margin-top: 8px;
`;
const MusicContainer = styled.View`
  justify-content: center;
  align-items: center;
`;
const MusicPlayBtn = styled.TouchableOpacity`
  border: 2px solid #b7b4df;
  border-radius: 15px;
  padding: 0 8px;
  margin-bottom: 8px;
`;
const ProfileMusic = styled.Text`
  margin: 8px 0;
`;

export default Profile;