import axios from 'axios';
import React, {useState, useLayoutEffect} from 'react';
import styled from 'styled-components/native';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import MarqueeView from 'react-native-marquee-view';
import {remote} from 'react-native-spotify-remote';
import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const MyFollwing = ({navigation: {navigate}}) => {
  const [friendList, setFriendData] = useState({});
  const isFocused = useIsFocused();
  const myUid = useSelector(state => state.kakaoUid);
  const BASE_URL = Config.BASE_URL;

  useLayoutEffect(() => {
    getMyFollowingList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const getMyFollowingList = async () => {
    try {
      console.log('start getMyFriendList');
      if (myUid.kakaoUid !== null) {
        await axios
          .get(`${BASE_URL}/friend/getMyFollowingList`, {
            params: {
              key: myUid.kakaoUid,
            },
          })
          .then(res => {
            console.log('res: ', res.data);

            setFriendData(res.data); //서버에게 받은 친구목록 setUseState 변수 할당
          });
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  return (
    <Container>
      <FriendList
        data={friendList}
        keyExtractor={item => item.id + ''}
        horizontal={false}
        renderItem={({item}) => (
          <Card
            width={width}
            onPress={() => {
              navigate('Stack', {
                screen: 'OtherUserProfile',
                params: {otherUid: item.friend_kakao_user_number, isFriend: 1},
              });
            }}>
            <UserInfo>
              <UserImg>
                <Avatar source={{uri: item.profileImg}} />
              </UserImg>
              <InfoBox>
                <UserName>{item.nickname}</UserName>
              </InfoBox>
            </UserInfo>
            <MusicPlay
              onPress={async () => {
                await remote.playUri(item.profileMusicUri);
              }}>
              {item.profileMusicUri !== null ? (
                <BtnContainer>
                  <UserMusic numberOfLines={1}>
                    {item.albumTitle} - {item.albumArtistName}
                  </UserMusic>

                  <Playbutton> ▶︎</Playbutton>
                </BtnContainer>
              ) : null}
            </MusicPlay>
          </Card>
        )}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #ffffff;
`;
const FriendList = styled.FlatList`
  margin: 12px 0;
`;
const Card = styled.TouchableOpacity`
  width: ${({width}) => (width - 10) / 1.05};
  padding: 15px 10px;
  border-radius: 20px;
  background-color: #ffffff;
  flex-direction: row;
  align-items: center;
  justify-content: space-between
  margin: 8px 15px;
  elevation: 3;
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;
const MusicPlay = styled.TouchableOpacity``;

const UserImg = styled.View`
  margin-right: 5px;
  padding: 5px;
`;

const Avatar = styled.Image`
  width: 55;
  height: 55;
  border-radius: 25px;
`;
const InfoBox = styled.View`
  margin: 5px;
`;
const UserName = styled.Text`
  margin-bottom: 3px;
  font-size: 15px;
  color: black;
`;
const UserMusic = styled.Text`
  font-size: 12px;
  color: #9b59b6;
`;
const Playbutton = styled.Text`
  font-size: 12px;
  position: absolute;
  right: 0px;
  bottom: 5px;
  color: #9b59b6;
`;
const BtnContainer = styled.View`
  flex-direction: row;
  padding: 5px;
  border-radius: 10;
  border: 1.5px #b7b4df;
  width: 200;
`;

export default MyFollwing;
