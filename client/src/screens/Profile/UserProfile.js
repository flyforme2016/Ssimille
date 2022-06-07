import React, {useState} from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileTabBar from '../../navigation/ProfileTapBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import CustomButton from '../../components/CustomButtons';
const Profile = ({navigation: {navigate}}) => {
  const [userImg, setUserImg] = useState();
  const [userName, setUserName] = useState();
  const [profileMusic, setProfileMusic] = useState();
  const [userTag, setUserTag] = useState([]);
  const [userPost, setUserPost] = useState();
  const [userFriend, setUserFriend] = useState();
  const [userSong, setUserSong] = useState();
  const getProfileElment = async () => {
    try {
      const value = await AsyncStorage.getItem('userNumber');
      if (value !== null) {
        // await axios
        //   .post('http://192.168.0.105:3000/profile/editProfile', {
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
          .get('http://192.168.0.105:3000/profile/getMyProfile', {
            params: {
              key: value,
            },
          })
          .then(res => {
            console.log('res: ', res.data);
            const userInfo = res.data;
            setUserName(userInfo.nickname);
            setUserImg(userInfo.profile_image);
            setProfileMusic(userInfo.profile_music_uri);
            setUserTag(userInfo.tag1_cd);
            setUserPost(userInfo.post_count);
            setUserFriend(userInfo.friend_count);
            setUserSong(userInfo.song_count);
          });
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };
  getProfileElment();

  return (
    <Container>
      <NavBar>
        <NavText>PROFILE</NavText>
      </NavBar>
      <Divider />

      <ProfileView>
        <ProfilePic source={{uri: userImg}} />
        <ProfileText>{userName}</ProfileText>
        <Follow>
          <Followview>
            <Followtext>POST</Followtext>
            <Followtext>{userPost}</Followtext>
          </Followview>
          <Followview>
            <Followtext>FREIND</Followtext>
            <Followtext>{userFriend}</Followtext>
          </Followview>
          <Followview>
            <Followtext>SONG</Followtext>
            <Followtext>{userSong}</Followtext>
          </Followview>
        </Follow>
        <ProfileText2>
          {profileMusic !== null ? profileMusic : '프로필뮤직을 설정해주세요'}
        </ProfileText2>
        <ProfileText3>
          {userTag !== null ? userTag : 'hashTag를 설정해주세요'}
        </ProfileText3>
      </ProfileView>
      <NavBar2>
        <CustomButton text="친구신청" />

        <CustomButton text="채팅하기" />
      </NavBar2>
      <ProfileTabBar />
    </Container>
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
const NavBar2 = styled.View`
  flex-direction: row;

  margin: 10px;
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
