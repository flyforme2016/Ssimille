import React from 'react';
import styled from 'styled-components/native';
import Swiper from 'react-native-swiper';
import getSpotifyToken from '../api/getSpotifyToken';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {remote} from 'react-native-spotify-remote';

const CommunityPost = ({navigation, route}) => {
  const [likePress, setLikePress] = useState(false);

  return (
    <Container>
      <Card>
        <UserInfo
          onPress={() => {
            navigation.navigate('Stack', {
              screen: 'UserProfile',
              params: {
                //값 확인
                key: route.params.kakao_user_id,
              },
            });
          }}>
          <UserImg source={{uri: route.params.profileImg}} />
          <UserInfoView>
            <UserName>{route.params.nickname}</UserName>
          </UserInfoView>
        </UserInfo>
        <PostText> {route.params.input_text}</PostText>
        <Divider />

        <Swiper height={200} loadMinimal={true} showsButtons={true}>
          <AlbumImgBtn
            onPress={async () => {
              await getSpotifyToken();
              await remote.playUri(route.params.music_uri);
            }}>
            <SelectedMusic>
              {route.params.album_title} - {route.params.album_artist_name}
            </SelectedMusic>
            <PostImg source={{uri: route.params.album_image}} />
          </AlbumImgBtn>
          <ImageContainer>
            {/* 사용자가 올린 사진 추가 */}
            {/* <PostImg source={require('../../assets/sample/2.jpg')} /> */}
          </ImageContainer>
        </Swiper>
        <Divider />
        <InterContainer>
          <Interaction
            onPress={() => {
              setLikePress(!likePress);
            }}>
            {route.params.like || likePress ? (
              <Ionicons name="heart" color="red" size={25} />
            ) : (
              <Ionicons name="heart-outline" size={25} />
            )}
            <InteractionText> Like ({route.params.like_count})</InteractionText>
          </Interaction>
          <Interaction>
            <Ionicons name="md-chatbubble-outline" size={25} />
            <InteractionText>
              Comment ({route.params.commentCount})
            </InteractionText>
          </Interaction>
        </InterContainer>
      </Card>
    </Container>
  );
};

const Container = styled.View`
  align-items: center;
`;

const Card = styled.View`
  background-color: #ffffff;
  justify-content: center;
  margin: 20px 0 5px 0;
  border-radius: 10px;
  elevation: 3;
`;

const UserInfo = styled.TouchableOpacity`
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
const SelectedMusic = styled.Text`
  font-size: 14px;
`;

const ImageContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const PostImg = styled.Image`
  width: 200;
  height: 200;
  margin: 5px;
`;
const AlbumImgBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;
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

export default CommunityPost;
