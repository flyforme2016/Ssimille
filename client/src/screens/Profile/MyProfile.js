import React from 'react';
import styled from 'styled-components/native';
import ProfileTabBar from './ProfileTapBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SpotifyTab from '../../components/SpotifyTab';
import {useSelector} from 'react-redux';
import {remote} from 'react-native-spotify-remote';
import {MusicControlBtn} from '../../components/MusicControlBtn';

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
    myProfileData && (
      <>
        <Container>
          <NavBar>
            <NavText>PROFILE</NavText>
            <Btn
              onPress={() =>
                navigation.push('Stack', {
                  screen: 'ProfileEdit',
                  params: {
                    profileImg: myProfileData.profile_image,
                    nickname: myProfileData.nickname,
                    hashTag: HashTag,
                    profileMusic: myProfileData.profile_music_uri,
                    albumImg: myProfileData.album_image,
                    albumTitle: myProfileData.album_title,
                    artistName: myProfileData.album_artist_name,
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
                <CountBtn>
                  <CountText>POST</CountText>
                  <CountText>{myProfileData.post_count}</CountText>
                </CountBtn>
                <CountBtn>
                  <CountText>FREIND</CountText>
                  <CountText>{myProfileData.friend_count}</CountText>
                </CountBtn>
                <CountBtn
                  onPress={() => {
                    navigation.push('Stack', {
                      screen: 'FavoriteSongs',
                      params: {
                        userId: myProfileData.kakao_user_number,
                      },
                    });
                  }}>
                  <CountText>SONG</CountText>
                  <CountText>{myProfileData.song_count}</CountText>
                </CountBtn>
              </CountContainer>
            </ProfileInfo>
          </ProfileContainer>
          <TagContainer>
            {HashTag?.map(data => {
              return (
                <TagBtn>
                  <TagText>#{data} </TagText>
                </TagBtn>
              );
            })}
          </TagContainer>

          {myProfileData.album_image ? (
            <Card>
              <MusicInfoContainer
                onPress={() => {
                  remote.playUri(myProfileData.profile_music_uri);
                }}>
                <MusicWrapper>
                  <CoverImg source={{uri: myProfileData.album_image}} />
                  <MusicInfo>
                    <MusicName> {myProfileData.album_title}</MusicName>
                    <ArtistName>{myProfileData.album_artist_name}</ArtistName>
                  </MusicInfo>
                  <MusicControlBtn type="play" />
                </MusicWrapper>
              </MusicInfoContainer>
            </Card>
          ) : null}
          <ProfileTabBar userId={myProfileData.kakao_user_number} />
        </Container>
        <SpotifyTab />
      </>
    )
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
  margin: 4px;
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
  padding: 5px;
`;
const Btn = styled.TouchableOpacity`
  width: 60px;
  position: absolute;
  right: -1px;
`;
const ProfileContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;
const UserInfo = styled.View`
  margin: 6px 12px;
  align-items: center;
`;

const Card = styled.View`
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
  margin: 5px 20px;
  border-radius: 10px;
`;

const MusicInfoContainer = styled.TouchableOpacity`
  width: 80%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-content: space-around;
  padding: 8px;
`;

const MusicWrapper = styled.View`
  flex-direction: row;
  margin: 0 8px;
`;
const CoverImg = styled.Image`
  width: 40px;
  height: 40px;
`;
const MusicInfo = styled.View`
  flex-direction: column;
  justify-content: center;
  margin: 0 15px;
`;

const MusicName = styled.Text`
  font-size: 14px;
  font-weight: bold;
`;

const ArtistName = styled.Text`
  font-size: 12px;
`;

const ProfilePic = styled.Image`
  width: 80;
  height: 80;
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
const CountBtn = styled.TouchableOpacity`
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
  font-size: 10px;
  padding: 0 2px;
`;
const TagText = styled.Text`
  margin: 2px 0;
  color: #b7b4df;
`;

export default Profile;
