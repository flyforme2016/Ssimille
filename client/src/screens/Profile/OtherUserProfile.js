import React, {useLayoutEffect, useState} from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import ProfileTabBar from './ProfileTapBar';

import CustomButton from '../../components/CustomButtons';
const Profile = ({navigation, route}) => {
  const [otherUserData, setOhterUserData] = useState({});
  const getOtherUserProfile = async () => {
    try {
      const otherUserUid = route.params.otherUid;
      if (otherUserUid !== null) {
        await axios
          .get('http://192.168.0.124:3000/profile/getUserProfile', {
            params: {
              key: otherUserUid,
            },
          })
          .then(res => {
            console.log('ress: ', res.data);
            setOhterUserData(res.data);       //서버에게 받아온 otherUserProfileData
          });
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };
  useLayoutEffect(() => {
    getOtherUserProfile();
  }, []);

  return (
    <Container>
      <NavBar>
        <NavText>PROFILE</NavText>
      </NavBar>
      <Divider />

      <ProfileView>
        <ProfilePic source={{uri: otherUserData.profile_image}} />
        <ProfileText>{otherUserData.nickname}</ProfileText>
        <Follow>
          <Followview>
            <Followtext>POST</Followtext>
            <Followtext>{otherUserData.post_count}</Followtext>
          </Followview>
          <Followview>
            <Followtext>FREIND</Followtext>
            <Followtext>{otherUserData.friend_count}</Followtext>
          </Followview>
          <Followview>
            <Followtext>SONG</Followtext>
            <Followtext>{otherUserData.song_count}</Followtext>
          </Followview>
        </Follow>
        <ProfileText2>
          {otherUserData.profile_music_uri !== null
            ? otherUserData.profile_music_uri
            : '프로필뮤직을 설정해주세요'}
        </ProfileText2>
        <ProfileText3>
          {otherUserData.tag1_cd !== null
            ? otherUserData.tag1_cd
            : 'hashTag를 설정해주세요'}
        </ProfileText3>
      </ProfileView>
      <NavBar2>
        <CustomButton
          text="친구신청 or 채팅하기"
          onPress={() => {
            navigation.navigate('Stack', {
              screen: 'OneByOneChating',
              params: {otherUid: route.params.otherUid, otherProfleImg: otherUserData.profile_image, otherNickname: otherUserData.nickname},
            });
          }}
        />
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
  justify-content: center;
  align-items: center;
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