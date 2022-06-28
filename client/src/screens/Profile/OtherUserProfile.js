import React, {useLayoutEffect, useState} from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import ProfileTabBar from './ProfileTapBar';
import CustomButton from '../../components/CustomButtons';
import {MusicControlBtn} from '../../components/MusicControlBtn';
import Config from 'react-native-config';
import {View, Text, TouchableOpacity} from 'react-native';
import sendAlarm from '../../functions/sendAlarm'
import deleteFriend from '../../functions/deleteFriend';
import { useSelector } from 'react-redux';

const Profile = ({navigation, route}) => {
  const [isFollow, setIsFollow] = useState(route.params.isFriend);
  const [otherUserData, setOtherUserData] = useState({});
  const {myProfileData} = useSelector(state => state.myProfile)
  const myUid = useSelector(state => state.kakaoUid)
  const otherUserUid = route.params.otherUid;
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

  const addFriendListener = () => {
    if(!isFollow){
      setIsFollow(!isFollow);
      const myData = {
        uid: myProfileData.kakao_user_number.toString(),
        nickname: myProfileData.nickname,
        profile_image: myProfileData.profile_image
      }
      sendAlarm(myData, otherUserData, "회원님을 팔로우 하였습니다.", 1)
      myProfileData.friend_count += 1
    }else{
      setIsFollow(!isFollow);
      deleteFriend(myUid.kakaoUid, otherUserUid)
      myProfileData.friend_count -= 1 
    }
  }

  return (
    <Container>
      <NavBar>
        <NavText>PROFILE</NavText>
      </NavBar>
      <Divider />

      <ProfileContainer>
        <UserInfo>
          <ProfileImage
            onPress={() => {
              console.log('clicked');
              navigation.push('Stack', {
                screen: 'BigPicture',
                params: {
                  userprofile: otherUserData.profile_image,
                },
              });
            }}>
            <ProfilePic source={{uri: otherUserData.profile_image}} />
          </ProfileImage>
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
        <TouchableOpacity onPress={addFriendListener}>
          <View
            style={{
              width: 95,
              height: 55,
              borderRadius: 5,
              backgroundColor: isFollow ? null : '#b7b4df',
              borderWidth: isFollow ? 1 : 0,
              borderColor: '#DEDEDE',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: isFollow ? 'black' : 'white',
                fontSize: 14,
                fontWeight: 'bold',
              }}>
              {isFollow ? '팔로잉' : '팔로우'}
            </Text>
          </View>
        </TouchableOpacity>

        <Button>
          <CustomButton
            text=" 채팅하기"
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
        </Button>
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
  flex-direction: row;
  justify-content: center;
`;
const BtnContainer2 = styled.View``;
const ProfileContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;
const ProfileImage = styled.TouchableOpacity``;
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
const Button = styled.Text`
  margin: 10px;
`;
const Button2 = styled.Text`
  margin: 10px;
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