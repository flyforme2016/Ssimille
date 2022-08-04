import React from 'react';
import styled from 'styled-components/native';
import {remote} from 'react-native-spotify-remote';
import {Dimensions} from 'react-native';
import {checkIsFriend} from '../api/Friend';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const FriendLists = ({data, listType, screenName}) => {
  const navigation = useNavigation();
  const {kakaoUid} = useSelector(state => state.kakaoUid);

  return (
    <Container>
      {data && (
        <FriendList
          data={data}
          keyExtractor={item => item.id + ''}
          horizontal={false}
          renderItem={({item}) => (
            <Card
              width={width}
              onPress={
                screenName === 'following'
                  ? async () => {
                      navigation.push('Stack', {
                        screen: 'OtherUserProfile',
                        params: {
                          otherUid: item.kakao_user_number,
                          isFriend: 1,
                        },
                      });
                    }
                  : async () => {
                      const flag = await checkIsFriend(
                        kakaoUid,
                        item.kakao_user_number,
                      );
                      if (flag === -1) {
                        navigation.push('TabBar', {screen: 'MyProfile'});
                      } else {
                        navigation.push('Stack', {
                          screen: 'OtherUserProfile',
                          params: {
                            otherUid: item.kakao_user_number,
                            isFriend: listType === 'otherUserList' ? flag : 1,
                          },
                        });
                      }
                    }
              }>
              <UserInfo>
                <UserImg>
                  <Avatar source={{uri: item.profileImg}} />
                </UserImg>
                <InfoBox>
                  <UserName>{item.nickname}</UserName>
                </InfoBox>
              </UserInfo>
              <MusicPlay
                onPress={() => {
                  remote.playUri(item.profileMusicUri);
                }}>
                {item.profileMusicUri === null ? null : item.albumTitle.length <
                  20 ? (
                  <BtnContainer2>
                    <UserMusic>
                      {item.albumTitle} - {item.albumArtistName}
                    </UserMusic>
                  </BtnContainer2>
                ) : (
                  <BtnContainer>
                    <UserMusic numberOfLines={1}>
                      {item.albumTitle} - {item.albumArtistName}
                    </UserMusic>
                  </BtnContainer>
                )}
              </MusicPlay>
            </Card>
          )}
        />
      )}
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
  width: ${({width}) => width - 20};
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
  width: 50;
  height: 50;
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
  white-space: pre-wrap;
`;

const BtnContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  padding: 5px;
  width: 170;
  border-radius: 10;
  border: 1.5px #b7b4df;
`;
const BtnContainer2 = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  padding: 5px;
  border-radius: 10;
  border: 1.5px #b7b4df;
`;

export default FriendLists;
