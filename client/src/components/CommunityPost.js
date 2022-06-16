import React, {useLayoutEffect, useState} from 'react';
import styled from 'styled-components/native';
import Swiper from 'react-native-swiper';
import getSpotifyToken from '../api/getSpotifyToken';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {remote} from 'react-native-spotify-remote';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostComments from './PostComments';

const CommunityPost = ({navigation, route}) => {
  const [comment, setComment] = useState();
  const [data, setData] = useState();
  const postSeq = route.params.post_seq;
  useLayoutEffect(() => {
    getComment();
  }, []);
  const getComment = async () => {
    try {
      await axios
        .get('http://192.168.0.124:3000/post/getPostComments', {
          params: {
            postSeq: postSeq,
          },
        })
        .then(
          res => {
            setData(res.data);
            console.log('댓글', res.data);
          },
          err => {
            console.log(err);
          },
        );
    } catch {
      err => console.log(err);
    }
  };

  const uploadComment = async () => {
    const value = await AsyncStorage.getItem('userNumber');
    try {
      await axios
        .post('http://192.168.0.124:3000/post/inputPostComment', {
          key: value,
          postSeq: postSeq,
          parent: 2,
          comment: comment,
        })
        .then(
          result => console.log(result, '업로드 완료'),
          err => {
            console.log(err);
          },
        );
    } catch {
      err => console.log(err);
    }
  };
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

        {/* <Swiper height={200} loadMinimal={true} showsButtons={true}>
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
            <PostImg source={require('../assets/sample/1.jpg')} />
          </ImageContainer>
        </Swiper> */}

        <InterContainer>
          <Interaction onPress={() => {}}>
            {route.params.likeNy ? (
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
        <Divider />
        <PostComments
          data={data}
          keyExtractor={item => item.comment_seq + ''}
        />
        <CommentInputContainer>
          <CommentInput
            multiline={true}
            placeholder="댓글을 입력해주세요"
            value={comment}
            onChangeText={text => setComment(text)}
          />
          <PostBtn onPress={uploadComment}>
            <Ionicons name="send" size={25} />
          </PostBtn>
        </CommentInputContainer>
      </Card>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  align-items: center;
`;

const Card = styled.View`
  background-color: #ffffff;
  justify-content: center;
  margin: 25px;
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
  align-self: center;
`;
const InterContainer = styled.View`
  width: 100%;
  flex-direction: row;

  justify-content: space-around;
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
const CommentInputContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin: 10px;
  padding-right: 10px;
`;
const CommentInput = styled.TextInput`
  width: 90%;
  border: 1px solid #dddddd;
  padding: 10px;
  margin-right: 10px;
`;
const PostBtn = styled.TouchableOpacity``;

export default CommunityPost;
