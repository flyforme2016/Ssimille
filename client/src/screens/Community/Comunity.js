import React from 'react';
import styled, {withTheme} from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Community = ({navigation: {navigate}}) => {
  return (
    <Container>
      <NavBar>
        <NavText>Community</NavText>
        <UploadBtn
          onPress={() => navigate('Stack', {screen: 'CommunityUpload'})}>
          <Ionicons name="duplicate" size={35} color="#b7b4df" />
        </UploadBtn>
      </NavBar>
      <NavDivider />
      <Card>
        <UserInfo>
          <UserImg />
          <UserInfoText>
            <UserName>윤승희</UserName>
            <PostTime>4 hours ago</PostTime>
          </UserInfoText>
        </UserInfo>
        <PostText> 테스트입니당</PostText>
        <PostImg />
        <Divider />
        <InterContainer>
          <Interaction active>
            <Ionicons name="heart-outline" size={25} />
            <InteractionText> Like </InteractionText>
          </Interaction>
          <Interaction>
            <Ionicons name="md-chatbubble-outline" size={25} />
            <InteractionText> Comment </InteractionText>
          </Interaction>
        </InterContainer>
      </Card>
      <Card>
        <UserInfo>
          <UserImg />
          <UserInfoText>
            <UserName>윤승희</UserName>
            <PostTime>4 hours ago</PostTime>
          </UserInfoText>
        </UserInfo>
        <PostText> 테스트입니당</PostText>
        <PostImg />
        <Divider />
        <InterContainer>
          <Interaction active>
            <Ionicons name="heart-outline" size={25} />
            <InteractionText> Like </InteractionText>
          </Interaction>
          <Interaction>
            <Ionicons name="md-chatbubble-outline" size={25} />
            <InteractionText> Comment </InteractionText>
          </Interaction>
        </InterContainer>
      </Card>
      <Card>
        <UserInfo>
          <UserImg />
          <UserInfoText>
            <UserName>윤승희</UserName>
            <PostTime>4 hours ago</PostTime>
          </UserInfoText>
        </UserInfo>
        <PostText> 테스트입니당</PostText>
        <PostImg />
        <Divider />
        <InterContainer>
          <Interaction active>
            <Ionicons name="heart-outline" size={25} />
            <InteractionText> Like </InteractionText>
          </Interaction>
          <Interaction>
            <Ionicons name="md-chatbubble-outline" size={25} />
            <InteractionText> Comment </InteractionText>
          </Interaction>
        </InterContainer>
      </Card>
    </Container>
  );
};

const Container = styled.ScrollView.attrs(() => ({
  backgroundColor: 'white',
  contentContainerStyle: {
    alignItems: 'center',
  },
}))``;

const NavDivider = styled.View`
  border-bottom-color: gray;
  border-bottom-width: 1px;
  width: 90%;
  align-self: center;
`;
const NavBar = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const NavText = styled.Text`
  color: #9b59b6;
  font-size: 24;
  padding: 10px;
`;
const UploadBtn = styled.TouchableOpacity`
  width: 60;
  position: relative;
  //right: -1px;
`;

const Card = styled.View`
  background-color: #f8f8f8;
  width: 90%;
  margin: 20px 0 5px 0;
  border-radius: 10px;
  elevation: 3;
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
const PostText = styled.Text`
  font-size: 14px;
  padding: 0 15px;
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

export default Community;
