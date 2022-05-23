import React, {useState} from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileTabBar from '../../navigation/ProfileTapBar';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Profile = ({navigation: {navigate}}) => {
  const [userImg, setUserImg] = useState();
  const [userName, setUserName] = useState();
  const [profileMusic, setProfileMusic] = useState();
  const [userTag, setUserTag] = useState([]);
  const getProfileElment = async () => {
    try {
      const value = await AsyncStorage.getItem('userNumber');
      if (value !== null) {
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
            setUserImg(userInfo.profile_image_url);
            setProfileMusic(userInfo.profile_music_uri);
            setUserTag(userInfo.tag1_cd);
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
        <ProfilePic source={{uri: userImg}} />
        <ProfileText>{userName}</ProfileText>
        <ProfileText>{profileMusic}</ProfileText>
        <ProfileText>{userTag}</ProfileText>
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
  width: 70;
  height: 70;
  padding: 15px;
  margin: 10px;
`;

const ProfileText = styled.Text`
  font-size: 16;
  padding: 5px;
`;

export default Profile;
