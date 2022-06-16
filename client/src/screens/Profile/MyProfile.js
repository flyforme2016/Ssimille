import React, {useState, useLayoutEffect} from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import ProfileTabBar from './ProfileTapBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SpotifyTab from '../../components/SpotifyTab';
import {useSelector} from 'react-redux';
import {remote} from 'react-native-spotify-remote';
import getSpotifyToken from '../../api/getSpotifyToken';

const Profile = ({navigation}) => {
  const [userData, setUserData] = useState({});
  const myUid = useSelector(state => state.kakaoUid);

  useLayoutEffect(() => {
    getProfileElment();
  }, []);
  const getProfileElment = async () => {
    try {
      console.log('start getProfileElement');
      if (myUid !== null) {
        await axios
          .get('http://192.168.0.124:3000/profile/getUserProfile', {
            params: {
              key: myUid.kakaoUid,
            },
          })
          .then(res => {
            console.log('res: ', res.data);
            const userInfo = res.data;
            setUserData(userInfo);
          });
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

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
                  profileImg: userData.profile_image,
                  nicknmae: userData.nickname,
                  hashTag: [
                    userData.tag1_cd,
                    userData.tag2_cd,
                    userData.tag3_cd,
                    userData.tag4_cd,
                    userData.tag5_cd,
                  ],
                  profileMusic: userData.profile_music_uri,
                },
              })
            }>
            <Ionicons name="settings-outline" size={35} />
          </Btn>
        </NavBar>
        <Divider />

        <ProfileContainer>
          <UserInfo>
            <ProfilePic source={{uri: userData.profile_image}} />
            <UserName>{userData.nickname}</UserName>
          </UserInfo>
          <ProfileInfo>
            <CountContainer>
              <CountView>
                <CountText>POST</CountText>
                <CountText>{userData.post_count}</CountText>
              </CountView>
              <CountView>
                <CountText>FREIND</CountText>
                <CountText>{userData.friend_count}</CountText>
              </CountView>
              <CountView>
                <CountText>SONG</CountText>
                <CountText>{userData.song_count}</CountText>
              </CountView>
            </CountContainer>
            <ProfileHashTag>
              {userData.tag1_cd} | {userData.tag2_cd} | {userData.tag3_cd}|
              {userData.tag4_cd} | {userData.tag5_cd}|
            </ProfileHashTag>
          </ProfileInfo>
        </ProfileContainer>
        <MusicContainer>
          <MusicPlayBtn
            onPress={async () => {
              console.log('clicked');
              await getSpotifyToken();
              await remote.playUri(userData.profile_music_uri);
            }}>
            <ProfileMusic>
              {userData.album_title} - {userData.album_artist_name}
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
const ProfileHashTag = styled.Text`
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
