/* eslint-disable prettier/prettier */
import React from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Container = styled.View`
  flex: 1;
  background-color: #b7b4df;
  justify-content: center;
  align-items: center;
`;
const Card = styled.View`
  background-color: #f8f8f8;
  width: 90%;
  margin-bottom: 20px;
  border-radius: 10px;
`;

const UserInfo = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  padding: 15px;
`;

const UserImg = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;
const UserInfoText = styled.View`
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;

const UserName = styled.Text`
  font-size: 14px;
  font-weight: bold;
`;
const PostTime = styled.Text`
  font-size: 12px;
  color: #666;
`;
const PostText = styled.TextInput`
  height: 250px;
`;

const PostImg = styled.Image`
  width: 100%;
  height: 250px;
  margin: 15px;
`;
const Divider = styled.View`
  border-bottom-color: #dddddd;
  border-bottom-width: 1px;
  width: 90%;
  margin-top: 15px;
  align-self: center;
`;
const InterContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 15px;
`;
const Interaction = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  border-radius: 5px;
  padding: 2px 5px;
  color: ${props => (props.active ? '#2e64e5' : 'transparent')};
`;

const InteractionText = styled.Text`
  font-size: 12px;
  font-weight: bod;
  margin: 5px;
  color: ${props => (props.active ? '#2e64e5' : '#333')};
`;
const CommunityUpload = () => {
  return (
    <Container>
      <Card>
        <UserInfo>
          <UserImg />
          <UserInfoText>
            <UserName>윤승희</UserName>
            <PostTime>4 hours ago</PostTime>
          </UserInfoText>
        </UserInfo>
        <PostText> </PostText>
        <PostImg />
        <Divider />
        <InterContainer>
          <Interaction active>
            <Ionicons name="checkmark-outline" size={25} />
            <InteractionText> Submit </InteractionText>
          </Interaction>
        </InterContainer>
      </Card>
    </Container>
  );
};

export default CommunityUpload;
