import React, {useState} from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import ProfileTabBar from './ProfileTapBar';
import {
  MusicControlBtn,
  CustomButton,
  FollowBtn,
  FollowButton,
} from '../../components/CustomButtons';
import Config from 'react-native-config';
import sendAlarm from '../../functions/sendAlarm';
import deleteFriend from '../../functions/deleteFriend';
import {useSelector} from 'react-redux';
import {Alert} from 'react-native';
import {remote} from 'react-native-spotify-remote';
import {useQuery} from 'react-query';
import TopNavBar from '../../components/TopNavBar';

const OtherUserProfile = ({navigation, route}) => {
  const [isFollow, setIsFollow] = useState(route.params.isFriend);
  const {myProfileData} = useSelector(state => state.myProfile);
  const myUid = useSelector(state => state.kakaoUid);
  const otherUserUid = route.params.otherUid;
  const BASE_URL = Config.BASE_URL;

  const {data: getUserProfile} = useQuery('getUserProfile', async () => {
    const {data} = await axios(`${BASE_URL}/users/profile`, {
      params: {
        key: otherUserUid,
      },
    });
    return data;
  });

  const addFriendListener = () => {
    if (!isFollow) {
      setIsFollow(!isFollow);
      const myData = {
        uid: myProfileData.kakao_user_number.toString(),
        nickname: myProfileData.nickname,
        profile_image: myProfileData.profile_image,
      };
      sendAlarm(myData, getUserProfile, '회원님을 팔로우 하였습니다.', 1);
      myProfileData.friend_count += 1;
    } else {
      Alert.alert('팔로잉 끊기', '팔로잉을 끊으시겠습니까?', [
        {text: 'Cancel'},
        {
          text: 'OK',
          onPress: () => {
            setIsFollow(!isFollow);
            deleteFriend(myUid.kakaoUid, otherUserUid);
            myProfileData.friend_count -= 1;
          },
        },
      ]);
    }
  };

  return (
    <Container>
      <TopNavBar navText="프로필" />
      <Divider />

      {getUserProfile && (
        <>
          <ProfileContainer>
            <UserInfo>
              <ProfileImage
                onPress={() => {
                  navigation.push('Stack', {
                    screen: 'BigPicture',
                    params: {
                      userprofile: getUserProfile.profile_image,
                    },
                  });
                }}>
                <ProfilePic source={{uri: getUserProfile.profile_image}} />
              </ProfileImage>
              <UserName>{getUserProfile.nickname}</UserName>
            </UserInfo>
            <ProfileInfo>
              <CountContainer>
                <CountBtn>
                  <CountText>POST</CountText>
                  <CountText>{getUserProfile.post_count}</CountText>
                </CountBtn>
                <CountBtn
                  onPress={() => {
                    navigation.push('TabBar', {
                      screen: 'FriendListContainer',
                      params: {
                        listType: 'otherUserList',
                        userId: otherUserUid,
                      },
                    });
                  }}>
                  <CountText>FREIND</CountText>
                  <CountText>{getUserProfile.friend_count}</CountText>
                </CountBtn>
                <CountBtn
                  onPress={() => {
                    navigation.push('Stack', {
                      screen: 'FavoriteSongs',
                      params: {
                        userId: route.params.otherUid,
                      },
                    });
                  }}>
                  <CountText>SONG</CountText>
                  <CountText>{getUserProfile.song_count}</CountText>
                </CountBtn>
              </CountContainer>

              <TagContainer>
                {getUserProfile.tag1_cd
                  ? [
                      getUserProfile.tag1_cd,
                      getUserProfile.tag2_cd,
                      getUserProfile.tag3_cd,
                      getUserProfile.tag4_cd,
                      getUserProfile.tag5_cd,
                    ]
                      .filter(tag => tag !== null)
                      .map(data => {
                        return (
                          <TagBtn>
                            <TagText># {data} </TagText>
                          </TagBtn>
                        );
                      })
                  : null}
              </TagContainer>
            </ProfileInfo>
          </ProfileContainer>
          <Card>
            {getUserProfile.album_image ? (
              <MusicInfoContainer
                onPress={() => {
                  remote.playUri(myProfileData.profile_music_uri);
                }}>
                <MusicWrapper>
                  <CoverImg source={{uri: getUserProfile.album_image}} />
                  <MusicInfo>
                    <MusicName> {getUserProfile.album_title}</MusicName>
                    <ArtistName>{getUserProfile.album_artist_name}</ArtistName>
                  </MusicInfo>
                </MusicWrapper>
                <MusicControlBtn type="play" />
              </MusicInfoContainer>
            ) : null}
          </Card>
          <BtnContainer>
            <FollowButton
              isFollow={isFollow}
              onPress={addFriendListener}
              text={isFollow ? '팔로잉' : '팔로우'}
            />
            <CustomButton
              text=" 채팅하기"
              onPress={() => {
                navigation.push('Stack', {
                  screen: 'OneByOneChating',
                  params: {
                    otherUid: route.params.otherUid,
                    otherProfleImg: getUserProfile.profile_image,
                    otherNickname: getUserProfile.nickname,
                  },
                });
              }}
            />
          </BtnContainer>
        </>
      )}
      <ProfileTabBar userId={otherUserUid} />
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
export default OtherUserProfile;
