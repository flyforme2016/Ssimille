import React, {useState} from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import getPostTime from '../../api/getPostTime';

const Data = [
  {
    id: 0,
    name: '윤승희',
    time: '2022-05-24T01:20:00',
    profileImg:
      'https://cdn4.iconfinder.com/data/icons/outlines-business-web-optimization/256/1-89-128.png',
    detail: '이것은 테스트입니다..',
    photo:
      'https://cdn4.iconfinder.com/data/icons/outlines-business-web-optimization/256/1-89-128.png',
    music: '',
    location: '',
    like: false,
    comments: 3,
  },
  {
    id: 1,
    name: '윤승희2',
    time: '2022-05-29T01:20:00',
    profileImg:
      'https://cdn4.iconfinder.com/data/icons/outlines-business-web-optimization/256/1-89-128.png',
    detail: '이것은 테스트입니다..',
    like: true,
    comments: 5,
  },
  {
    id: 2,
    name: '윤승희3',
    time: '2022-06-01T01:20:00',
    profileImg:
      'https://cdn4.iconfinder.com/data/icons/outlines-business-web-optimization/256/1-89-128.png',
    detail: '이것은 테스트입니다..',
    like: true,
    comments: 0,
  },
];
const TotalCommunity = ({navigation: {navigate}}) => {
  const [like, setLike] = useState(false);
  const handleLike = async () => {
    await setLike(!like);
  };
  return (
    <Container>
      <PostList
        data={Data}
        keyExtractor={item => item.id + ''}
        horizontal={false}
        renderItem={({item}) => (
          <Card>
            <UserInfo>
              <UserImg source={{uri: item.profileImg}} />
              <UserInfoView>
                <UserName>{item.name}</UserName>
                <PostTime>{getPostTime(item.time)}</PostTime>
              </UserInfoView>
            </UserInfo>
            <PostText> {item.detail}</PostText>
            <PostImg source={{uri: item.photo}} />
            <PostMusic />
            <Divider />
            <InterContainer>
              <Interaction onPress={handleLike}>
                {item.like ? (
                  <Ionicons name="heart" color="red" size={25} />
                ) : (
                  <Ionicons name="heart-outline" size={25} />
                )}
                <InteractionText> Like </InteractionText>
              </Interaction>
              <Interaction>
                <Ionicons name="md-chatbubble-outline" size={25} />
                <InteractionText> Comment ({item.comments}) </InteractionText>
              </Interaction>
            </InterContainer>
          </Card>
        )}
      />
    </Container>
  );
};

const Container = styled.View`
  align-items: center;
`;

const PostList = styled.FlatList`
  width: 90%;
`;

const Card = styled.View`
  background-color: #ffffff;
  justify-content: center;
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
const UserInfoView = styled.View`
  flex-direction: column;
  justify-content: center;
  margin-left: 15px;
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
  width: 100;
  margin: 15px;
`;
const PostMusic = styled.View``;
const Divider = styled.View`
  border-bottom-color: #dddddd;
  border-bottom-width: 1px;
  width: 90%;
  margin-top: 15px;
  align-self: center;
`;
const InterContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  padding: 12px;
  background-color: #ffffff;
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

export default TotalCommunity;
