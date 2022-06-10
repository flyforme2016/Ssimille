import React from 'react';
import {FlatList} from 'react-native';
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../../../styles/MessageStyles';
import styled from 'styled-components/native';
import SpotifyTab from '../../components/SpotifyTab';

const Messages = [
  {
    id: '1',
    userName: 'user1',
    userImg: require('../../assets/sample/1.jpg'),
    messageTime: '4 mins ago',
    messageText: '안녕하세요 저랑 음악취향이 같으셔서 친추 걸어봤습니다.',
  },
  {
    id: '2',
    userName: 'user2',
    userImg: require('../../assets/sample/2.jpg'),
    messageTime: '2 hours ago',
    messageText: '엿이나 까잡수세요',
  },
  {
    id: '3',
    userName: 'user3',
    userImg: require('../../assets/sample/3.jpg'),
    messageTime: '1 hours ago',
    messageText: '저는 바보입니다 그게 확실해요',
  },
  {
    id: '4',
    userName: 'user4',
    userImg: require('../../assets/sample/4.jpg'),
    messageTime: '1 day ago',
    messageText: '홀리몰리 과카몰리',
  },
  {
    id: '5',
    userName: 'user5',
    userImg: require('../../assets/sample/5.jpg'),
    messageTime: '2 days ago',
    messageText: '나좀 도와줘',
  },
];

const MessagesScreen = ({navigation: {navigate}}) => {
  return (
    <>
      <Container>
        <NavText>채팅창</NavText>
        <FlatList
          data={Messages}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <Card onPress={() => navigate('Stack', {screen: 'ChatScreen'})}>
              <UserInfo>
                <UserImgWrapper>
                  <UserImg source={item.userImg} />
                </UserImgWrapper>
                <TextSection>
                  <UserInfoText>
                    <UserName>{item.userName}</UserName>
                    <PostTime>{item.messageTime}</PostTime>
                  </UserInfoText>
                  <MessageText>{item.messageText}</MessageText>
                </TextSection>
              </UserInfo>
            </Card>
          )}
        />
      </Container>
      <SpotifyTab />
    </>
  );
};

export default MessagesScreen;

const NavText = styled.Text`
  color: #9b59b6;
  font-size: 30;
  padding: 15px;
`;
