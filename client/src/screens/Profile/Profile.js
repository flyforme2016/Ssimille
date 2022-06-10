import React, {useState, useLayoutEffect} from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileTabBar from './ProfileTapBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useIsFocused} from '@react-navigation/native';
import SpotifyTab from '../../components/SpotifyTab';

const Profile = ({navigation: {navigate}}) => {
  const [userData, setUserData] = useState({});
  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    getProfileElment();
  }, [isFocused]);
  const getProfileElment = async () => {
    try {
      console.log('start getProfileElement');
      const value = await AsyncStorage.getItem('userNumber');
      if (value !== null) {
        // await axios
        //   .post('http://192.165.0.104:3000/profile/editProfile', {
        // params: {
        //   nickname: 'nicknameTest1',
        //   profileImg: 'profileImgTest1',
        //   profileMusicUri: 'profileMusicUriTest1',
        //   hashTag: ['tag1_Cd', null, null, null, null],
        //   key: value,
        // },
        //   })
        //   .then(res => {
        //     console.log('Test editProfile');
        //   });
        await axios
          .get('http://192.168.0.124:3000/profile/getMyProfile', {
            params: {
              key: value,
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
          <Btn onPress={() => navigate('Stack', {screen: 'ProfileEdit'})}>
            <Ionicons name="settings-outline" size={35} />
          </Btn>
        </NavBar>
        <Divider />

        <ProfileView>
          <ProfilePic source={{uri: userData.profile_image}} />
          <ProfileText>{userData.nickname}</ProfileText>
          <Follow>
            <Followview>
              <Followtext>POST</Followtext>
              <Followtext>{userData.post_count}</Followtext>
            </Followview>
            <Followview>
              <Followtext>FREIND</Followtext>
              <Followtext>{userData.friend_count}</Followtext>
            </Followview>
            <Followview>
              <Followtext>SONG</Followtext>
              <Followtext>{userData.song_count}</Followtext>
            </Followview>
          </Follow>
          <ProfileText2>
            {userData.profile_music_uri !== null
              ? userData.profile_music_uri
              : '프로필뮤직을 설정해주세요'}
          </ProfileText2>
          <ProfileText3>
            {userData.tag1_cd !== null
              ? userData.tag1_cd
              : 'hashTag를 설정해주세요'}
          </ProfileText3>
        </ProfileView>

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
const Follow = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
  left: 60px;
  bottom: 130px;
`;

const Followview = styled.View`
  align-items: center;
`;
const Followtext = styled.Text`
  font-weight: bold;
  font-size: 15;
  margin: 8px;
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

const ProfileView = styled.View`
  flex: 0.55;
  padding: 12px;
  align-items: center;
`;

const ProfilePic = styled.Image`
  width: 100;
  height: 100;
  padding: 15px;
  margin: 10px;
  position: relative;
  right: 130px;
`;

const ProfileText = styled.Text`
  font-size: 16;
  padding: 5px;
  position: relative;
  right: 130px;
  bottom: 15px;
`;
const ProfileText2 = styled.Text`
  font-size: 16;
  padding: 5px;
  position: relative;
  left: 60px;
  bottom: 120px;
`;
const ProfileText3 = styled.Text`
  font-size: 16;
  padding: 5px;
  position: relative;
  bottom: 120px;
`;

export default Profile;
