import React, {useState} from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import ProfileTabBar from './ProfileTapBar';
import {MusicControlBtn} from '../../components/MusicControlBtn';
import Config from 'react-native-config';
import sendAlarm from '../../functions/sendAlarm';
import deleteFriend from '../../functions/deleteFriend';
import {useSelector} from 'react-redux';
import {useQuery} from 'react-query';
import TopNavBar from '../../components/TopNavBar';
import {remote} from 'react-native-spotify-remote';

const Profile = ({navigation, route}) => {
  console.log(route.params.otherUid);
  const [isFollow, setIsFollow] = useState(route.params.isFriend);
  const {myProfileData} = useSelector(state => state.myProfile);
  const {kakaoUid} = useSelector(state => state.kakaoUid);
  const BASE_URL = Config.BASE_URL;
  const {data: otherUserData} = useQuery('otherUserData', async () => {
    const {data} = await axios(`${BASE_URL}/profile/getUserProfile`, {
      params: {
        key: route.params.otherUid,
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
      sendAlarm(myData, otherUserData, '회원님을 팔로우 하였습니다.', 1);
      myProfileData.friend_count += 1;
    } else {
      setIsFollow(!isFollow);
      deleteFriend(kakaoUid, route.params.otherUid);
      myProfileData.friend_count -= 1;
    }
  };

  return (
    <Container>
      <TopNavBar navText="프로필" />
      <Divider />
      {otherUserData && (
        <>
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
                  <CountText>{otherUserData.song_count}</CountText>
                </CountBtn>
              </CountContainer>

              <TagContainer>
                {otherUserData.tag1_cd
                  ? [
                      otherUserData.tag1_cd,
                      otherUserData.tag2_cd,
                      otherUserData.tag3_cd,
                      otherUserData.tag4_cd,
                      otherUserData.tag5_cd,
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
            {otherUserData.album_image ? (
              <MusicInfoContainer
                onPress={() => {
                  remote.playUri(myProfileData.profile_music_uri);
                }}>
                <MusicWrapper>
                  <CoverImg source={{uri: otherUserData.album_image}} />
                  <MusicInfo>
                    <MusicName> {otherUserData.album_title}</MusicName>
                    <ArtistName>{otherUserData.album_artist_name}</ArtistName>
                  </MusicInfo>
                </MusicWrapper>
                <MusicControlBtn type="play" />
              </MusicInfoContainer>
            ) : null}
          </Card>

          <BtnContainer>
            <FollowBtn onPress={addFriendListener} isFollow={isFollow}>
              <BtnText isFollow={isFollow}>
                {isFollow ? '팔로잉' : '팔로우'}
              </BtnText>
            </FollowBtn>

            <FollowBtn
              onPress={() => {
                navigation.navigate('Stack', {
                  screen: 'OneByOneChating',
                  params: {
                    otherUid: route.params.otherUid,
                    otherProfleImg: otherUserData.profile_image,
                    otherNickname: otherUserData.nickname,
                  },
                });
              }}>
              <BtnText>채팅하기</BtnText>
            </FollowBtn>
          </BtnContainer>
        </>
      )}
      <ProfileTabBar userId={route.params.otherUid} />
    </Container>
  );
};
const FollowBtn = styled.TouchableOpacity`
  width: 95;
  height: 55;
  border-radius: 5;
  border-color: #dedede;
  justify-content: center;
  align-items: center;
  background-color: ${props => (props.isFollow ? null : '#b7b4df')};
`;
const BtnText = styled.Text`
  color: ${props => (props.isFollow ? 'black' : 'white')};
  font-size: 14;
  font-weight: bold;
`;
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
export default Profile;
