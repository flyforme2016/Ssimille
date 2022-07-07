import React, {useLayoutEffect, useState} from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import ProfileTabBar from './ProfileTapBar';
import CustomButton from '../../components/CustomButtons';
import {MusicControlBtn} from '../../components/MusicControlBtn';
import Config from 'react-native-config';
import {TouchableOpacity} from 'react-native';
import sendAlarm from '../../functions/sendAlarm';
import deleteFriend from '../../functions/deleteFriend';
import {useSelector} from 'react-redux';
<<<<<<< HEAD
import {Alert} from 'react-native';
import {DeviceEventEmitter} from 'react-native';
=======
import {useQuery} from 'react-query';
import TopNavBar from '../../components/TopNavBar';
>>>>>>> fcb1b61aca7cd96b5814391f218325956de5a38a
import {remote} from 'react-native-spotify-remote';

const Profile = ({navigation, route}) => {
  const [isFollow, setIsFollow] = useState(route.params.isFriend);
  const [otherUserData, setOtherUserData] = useState({});
  const {myProfileData} = useSelector(state => state.myProfile);
  const myUid = useSelector(state => state.kakaoUid);
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
      <NavBar>
        <NavText>PROFILE</NavText>
      </NavBar>
      <Divider />

<<<<<<< HEAD
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
            <CountBtn
              onPress={() => {
                navigation.push('Stack', {
                  screen: 'OtherTabBar',
                  params: {
                    userId: otherUserUid,
                  },
                });
              }}>
              <CountText>FREIND</CountText>
              <CountText>{otherUserData.friend_count}</CountText>
            </CountBtn>
            <CountBtn
=======
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
>>>>>>> fcb1b61aca7cd96b5814391f218325956de5a38a
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
              DeviceEventEmitter.emit('refetchMusic');
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
        <TouchableOpacity onPress={addFriendListener}>
          <FriendView isFollow={isFollow}>
            <FriendText isFollow={isFollow}>
              {isFollow ? '팔로잉' : '팔로우'}
            </FriendText>
          </FriendView>
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
const FriendView = styled.View`
  width: 95;
  height: 55;
  border-radius: 5;
  border-color: #000;
  justify-content: center;
  align-items: center;
  background-color: ${props => (props.isFollow ? 'white' : '#b7b4df')};
  border-width: ${props => (props.isFollow ? 1 : 0)};
`;
const FriendText = styled.Text`
  color: ${props => (props.isFollow ? 'black' : 'white')};
  font-size: 14;
  font-weight: bold;
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
