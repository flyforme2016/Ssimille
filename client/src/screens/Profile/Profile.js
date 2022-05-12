import React from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileTabBar from '../../navigation/ProfileTapBar';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AVARTA = {
  uri: 'https://ssimille-bucket.s3.ap-northeast-2.amazonaws.com/defaultProfileImg/defaultProfileImg.png',
  width: 70,
  height: 70,
};

const Profile = ({navigation: {navigate}}) => {
  const getProfileElment = async () => {
    try {
      const value = await AsyncStorage.getItem('userNumber');
      if (value !== null) {
        const response = await axios
          .get('http://192.168.0.106:3000/userProfile', {
            params: {
              key: value,
            },
          })
          .then(res => {
            console.log('res: ', res['data']);
          })
          .catch(err => {
            console.log('err: ', err);
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
        <Btn onPress={() => navigate('Stack', {screen: 'ProfileEdit'})}>
          <Ionicons name="settings-outline" size={35} />
        </Btn>
      </NavBar>
      <Divider />

      <ProfileView>
        <ProfilePic source={AVARTA} />
        <ProfileText>사용자이름</ProfileText>
        <ProfileText>노래이름</ProfileText>
        <ProfileText>한줄소개글</ProfileText>
      </ProfileView>

      <ProfileTabBar />
    </Container>
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

const ProfileView = styled.View`
  padding: 12px;
  align-items: center;
`;

const ProfilePic = styled.Image`
  padding: 15px;
  margin: 10px;
`;

const ProfileText = styled.Text`
  font-size: 16;
  padding: 5px;
`;

export default Profile;
