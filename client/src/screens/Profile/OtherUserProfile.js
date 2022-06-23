import React, {useLayoutEffect, useState} from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import ProfileTabBar from './ProfileTapBar';
import CustomButton from '../../components/CustomButtons';
import {MusicControlBtn} from '../../components/MusicControlBtn';
import Config from 'react-native-config';

const Profile = ({navigation, route}) => {
  const [otherUserData, setOtherUserData] = useState({});

  const BASE_URL = Config.BASE_URL;
  const HashTag = [
    otherUserData.tag1_cd,
    otherUserData.tag2_cd,
    otherUserData.tag3_cd,
    otherUserData.tag4_cd,
    otherUserData.tag5_cd,
  ].filter(tag => tag !== null);

  const getOtherUserProfile = async () => {
    try {
      const otherUserUid = route.params.otherUid;
      if (otherUserUid !== null) {
        await axios
          .get(`${BASE_URL}/profile/getUserProfile`, {
            params: {
              key: otherUserUid,
            },
          })
          .then(res => {
            setOtherUserData(res.data); //서버에게 받아온 otherUserProfileData
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

      <ProfileContainer>
        <UserInfo>
          <ProfilePic source={{uri: otherUserData.profile_image}} />
          <UserName>{otherUserData.nickname}</UserName>
        </UserInfo>
        <ProfileInfo>
          <CountContainer>
            <CountBtn>
              <CountText>POST</CountText>
              <CountText>{otherUserData.post_count}</CountText>
            </CountBtn>
            <CountBtn>
              <CountText>FREIND</CountText>
              <CountText>{otherUserData.friend_count}</CountText>
            </CountBtn>
            <CountBtn>
              <CountText>SONG</CountText>
              <CountText>{otherUserData.song_count}</CountText>
            </CountBtn>
          </CountContainer>

          <TagContainer>
            {HashTag.map(data => {
              return (
                <TagBtn>
                  <TagText># {data} </TagText>
                </TagBtn>
              );
            })}
          </TagContainer>
        </ProfileInfo>
      </ProfileContainer>
      {otherUserData.album_image ? (
        <Card>
          <MusicInfoContainer>
            <MusicWrapper>
              <CoverImg source={{uri: otherUserData.album_image}} />
              <MusicInfo>
                <MusicName> {otherUserData.album_title}</MusicName>
                <ArtistName>{otherUserData.album_artist_name}</ArtistName>
              </MusicInfo>
            </MusicWrapper>
            <MusicControlBtn type="play" />
          </MusicInfoContainer>
        </Card>
      ) : (
        <MusicName>프로필 뮤직이 없습니다.</MusicName>
      )}
      <BtnContainer>
        <CustomButton
          text="친구신청 or 채팅하기"
          onPress={() => {
            navigation.navigate('Stack', {
              screen: 'OneByOneChating',
              params: {
                otherUid: route.params.otherUid,
                otherProfleImg: otherUserData.profile_image,
                otherNickname: otherUserData.nickname,
              },
            });
          }}
        />
      </BtnContainer>

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
const BtnContainer = styled.TouchableOpacity`
  align-items: center;
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
