import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useEffect, useState, useContext} from 'react';
import styled from 'styled-components/native';

const data = [
  {
    id: 0,
    name: '윤승희',
  },
  {
    id: 1,
    name: '윤승희2',
  },
];

const CurrentFriendList = ({navigation: {navigate}}) => {
  const [friendData, setFriendData] = useState();

  // 누르면 각 유저별 채팅화면으로 넘어가는 함수
  const moveChatScreen = () => {
    navigate('TabBar', {screen: 'ChatScreen'});
  };
  // 누르면 상대 프로필 보여지는 함수

  const showProfileScreen = async () => {
    const value = await AsyncStorage.getItem('userNumber');
    try {
      if (value !== null) {
        await axios
          .get('http://192.168.0.105:3000/friend/getFriendList', {
            params: {
              key: value,
            },
          })
          .then(res => {
            console.log('res: ', res.data);
            const userInfo = res.data;
            setFriendData(userInfo[0].nickname);
          });
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };
  useEffect(() => {
    showProfileScreen();
  });

  return (
    <Container>
      <FriendList
        data={data}
        keyExtractor={item => item.id + ''}
        horizontal={false}
        renderItem={({item}) => (
          <Card>
            <UserInfo>
              <UserImg>
                <Avatar source={require('../../assets/sample/1.jpg')} />
              </UserImg>
              <InfoBox>
                <UserName>{item.name}</UserName>
                <UserMusic>Music</UserMusic>
              </InfoBox>
            </UserInfo>
            <BtnContainer>
              <Btn onpress={showProfileScreen}>
                <ChatText>프로필보기</ChatText>
              </Btn>
              <Btn onpress={moveChatScreen}>
                <ChatText>채팅하기</ChatText>
              </Btn>
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
const Card = styled.View`
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
  width: 50;
  height: 50;
  border-radius: 25px;
`;
const InfoBox = styled.View`
  margin: 12px;
`;
const UserName = styled.Text`
  margin-bottom: 3px;
  font-size: 16px;
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
