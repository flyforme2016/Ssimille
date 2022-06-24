import axios from 'axios';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import styled from 'styled-components/native';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import checkIsFriend from '../../api/checkIsFriend';

const CurrentFriendList = ({navigation}) => {
  const [friendList, setFriendData] = useState({});
  const isFocused = useIsFocused();
  const myUid = useSelector(state => state.kakaoUid);
  const BASE_URL = Config.BASE_URL;

  useLayoutEffect(() => {
    getMyFriendList();
  }, [isFocused]);

  const getMyFriendList = async () => {
    try {
      console.log('start getMyFriendList');
      if (myUid.kakaoUid !== null) {
        await axios
          .get(`${BASE_URL}/friend/getFriendList`, {
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
          onPress={() => {
            navigation.navigate('Stack', {
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
            <BtnContainer>
              <UserMusic>
                {item.profileMusicUri !== null
                  ? item.profileMusicUri
                  : '프로필뮤직이 없습니다'}
              </UserMusic>
            </BtnContainer>
          </Card>
        )}
      />
    </Container>
  );
};

const Container = styled.View`
  align-items: center;
  background-color: #ffffff;
`;
const FriendList = styled.FlatList`
  margin: 12px 0;
`;
const Card = styled.TouchableOpacity`
width : 85%;
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
  margin: 12px;
`;
const UserName = styled.Text`
  margin-bottom: 3px;
  font-size: 20px;
  color: gray;
`;
const UserMusic = styled.Text`
  font-size: 12px;
  color: gray;
`;
const BtnContainer = styled.View`
  flex-direction: row;
`;
const Btn = styled.TouchableOpacity`
  width: 80;
  height: 40;
  margin: 7px;
  align-items: center;
  justify-content: center;
  border: 1px solid gray;
  border-radius: 15px;
`;
const ChatText = styled.Text`
  font-size: 14px;
`;
export default CurrentFriendList;