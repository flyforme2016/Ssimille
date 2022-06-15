import React, {useLayoutEffect, useState} from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import getPostTime from '../../api/getPostTime';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Dimensions} from 'react-native';
import Swiper from 'react-native-swiper';
import getSpotifyToken from '../../api/getSpotifyToken';
import {remote} from 'react-native-spotify-remote';
const {width} = Dimensions.get('window');

const TotalCommunity = ({navigation, route}) => {
  const [likePress, setLikePress] = useState(false);
  const [postData, setPostData] = useState();

  const getData = async () => {
    const value = await AsyncStorage.getItem('userNumber');
    await axios
      .get('http://192.168.0.124:3000/post/getPostList', {
        params: {
          key: value,
        },
      })
      .then(
        res => {
          console.log('res: ', res.data);
          setPostData(res.data);
        },
        err => {
          console.log('게시글 정보 받아오기 실패', err);
        },
      );
  };

  useLayoutEffect(() => {
    getData();
  }, []);

  return (
    <Container>
      <PostList
        data={postData}
        keyExtractor={item => item.post_seq + ''}
        horizontal={false}
        renderItem={({item}) => (
          <Card>
            <UserInfo
              onPress={() => {
                navigation.navigate('Stack', {
                  screen: 'UserProfile',
                  params: {
                    //값 확인
                    key: item.kakao_user_number,
                  },
                });
              }}>
              <UserImg source={{uri: item.profileImg}} />
              <UserInfoView>
                <UserName>{item.nickname}</UserName>
                <PostTime>{getPostTime(item.time)}</PostTime>
              </UserInfoView>
            </UserInfo>
            <PostText> {item.input_text}</PostText>
            <Divider />

            <Swiper height={200} loadMinimal={true} showsButtons={true}>
              <AlbumImgBtn
                onPress={async () => {
                  await getSpotifyToken();
                  await remote.playUri(item.music_uri);
                }}>
                <SelectedMusic>
                  {item.album_title} - {item.album_artist_name}
                </SelectedMusic>
                <PostImg source={{uri: item.album_image}} />
              </AlbumImgBtn>
              <ImageContainer>
                {/* 사용자가 올린 사진 추가 */}
                <PostImg source={require('../../assets/sample/2.jpg')} />
              </ImageContainer>
            </Swiper>
            <Divider />
            <InterContainer
              onPress={() => {
                navigation.navigate('Stack', {
                  screen: 'CommunityPost',
                  params: {
                    albumTitle: item.name,
                    albumArtistName: item.artists[0].name,
                    albumImg: item.album.images[0].url,
                    musicUri: item.uri,
                  },
                  // merge: true,
                });
              }}>
              <Interaction
                onPress={() => {
                  console.log(item.post_seq);
                  setLikePress(!likePress);
                }}>
                {item.like || likePress ? (
                  <Ionicons name="heart" color="red" size={25} />
                ) : (
                  <Ionicons name="heart-outline" size={25} />
                )}
                <InteractionText> Like ({item.like_count})</InteractionText>
              </Interaction>
              <Interaction>
                <Ionicons name="md-chatbubble-outline" size={25} />
                <InteractionText>Comment ({item.commentCount})</InteractionText>
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
const InterContainer = styled.TouchableOpacity`
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
