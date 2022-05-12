import React from 'react';
import styled from 'styled-components/native';

const CurrentFriendList = ({navigation: {navigate}}) => {
  // 누르면 각 유저별 채팅화면으로 넘어가는 함수
  const moveChatScreen = () => {
    navigate('TabBar', {screen: 'ChatScreen'});
  };
  // 누르면 상대 프로필 보여지는 함수
  const showProfileScreen = () => {
    navigate('TabBar', {screen: 'Profile'});
  };
  return (
    <Container>
      <Card>
        <UserInfo>
          <UserImg>
            <Avatar source={require('../../assets/sample/1.jpg')} />
          </UserImg>
          <InfoBox>
            <UserName>Name</UserName>
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
      <Card>
        <UserInfo>
          <UserImg>
            <Avatar source={require('../../assets/sample/1.jpg')} />
          </UserImg>
          <InfoBox>
            <UserName>Name</UserName>
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
      <Card>
        <UserInfo>
          <UserImg>
            <Avatar source={require('../../assets/sample/1.jpg')} />
          </UserImg>
          <InfoBox>
            <UserName>Name</UserName>
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
    </Container>
  );
};

const Container = styled.View`
  margin-top: 10px;
  justify-content: center;
`;
const Card = styled.View`
  padding: 15px 10px;
  border-radius: 20px;
  background-color: #ffffff;
  align-items: center;
  margin: 8px 15px;
  elevation: 3;
`;

const UserInfo = styled.View`
  align-items: center;
  justify-content: center;
`;

const UserImg = styled.View`
  padding: 5px;
`;

const Avatar = styled.Image`
  width: 70;
  height: 70;
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
