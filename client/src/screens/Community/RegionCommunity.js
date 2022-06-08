import React, {useReducer, useState} from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import getPostTime from '../../api/getPostTime';

const RegionCommunity = ({navigation: {navigate}}) => {
  const [like, setLike] = useState(false);
  const time = getPostTime('2022-05-24T01:20:00');
  const handleLike = async () => {
    await setLike(!like);
  };
  return (
    <Container>
      <Card>
        <UserInfo>
          <UserImg />
          <UserInfoText>
            <UserName>윤승희</UserName>
            <PostTime>{time}</PostTime>
          </UserInfoText>
        </UserInfo>
        <PostText> 테스트입니당</PostText>
        <PostImg />
        <Divider />
        <InterContainer>
          <Interaction onPress={handleLike}>
            {like ? (
              <Ionicons name="heart" color="red" size={25} />
            ) : (
              <Ionicons name="heart-outline" size={25} />
            )}
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
  font-weight: bold;
  margin: 5px;
  color: ${props => (props.active ? '#2e64e5' : '#333')};
`;

export default RegionCommunity;
