import React, {useState} from 'react';
import styled from 'styled-components/native';
import Swiper from 'react-native-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {remote} from 'react-native-spotify-remote';
import axios from 'axios';
import Config from 'react-native-config';
import checkIsFriend from '../api/checkIsFriend';
import {useSelector} from 'react-redux';
import getPostTime from '../functions/getPostTime';
import {Alert} from 'react-native';
import {deletePost} from '../api/community/deletePost';
import {useQuery, useMutation} from 'react-query';
import {handleLike} from '../api/community/handleLike';
import {uploadComment} from '../api/community/uploadComment';
import {deleteComment} from '../api/community/deleteComment';

const CommunityPost = ({navigation, route}) => {
  const BASE_URL = Config.BASE_URL;
  const {kakaoUid} = useSelector(state => state.kakaoUid);
  const [comment, setComment] = useState();
  console.log('gridpost datas', route.params.data);
  const {
    isLoading: commentsLoading,
    data: postComments,
    refetch,
  } = useQuery(
    'postComments',
    async () => {
      const {data} = await axios(`${BASE_URL}/post/getPostComments`, {
        params: {
          postSeq: route.params.data.post_seq,
        },
      });
      return data;
    },
    {
      onSuccess: res => {
        console.log('댓글', res);
      },
    },
  );
  const commentMutation = useMutation(async () => {
    refetch();
  });

  return (
    <Container>
      <Card>
        <UserWrapper>
          <UserInfo
            onPress={async () => {
              const flag = await checkIsFriend(
                kakaoUid,
                route.params.data.kakao_user_number,
              );
              console.log('flag: ', flag);
              if (flag === -1) {
                navigation.navigate('TabBar', {screen: 'MyProfile'});
              } else {
                navigation.navigate('Stack', {
                  screen: 'OtherUserProfile',
                  params: {
                    otherUid: route.params.data.kakao_user_number,
                    isFriend: flag,
                  },
                });
              }
            }}>
            <UserImg source={{uri: route.params.data.profile_image}} />
            <UserInfoView>
              <UserName>{route.params.data.nickname}</UserName>
              <PostTime>{getPostTime(route.params.data.reg_time)}</PostTime>
            </UserInfoView>
          </UserInfo>
          {kakaoUid === route.params.data.kakao_user_number + '' ? (
            <Ionicons
              onPress={async () => {
                Alert.alert('게시글 삭제', '게시글을 삭제하시겠습니까?', [
                  {text: 'Cancel'},
                  {
                    text: 'OK',
                    onPress: () => {
                      deletePost(kakaoUid, route.params.data.post_seq);
                      // 프로필 or 전체 게시글로 다시 돌아감
                      navigation.goBack();
                    },
                  },
                ]);
              }}
              name="ellipsis-horizontal"
              size={25}
            />
          ) : null}
        </UserWrapper>
        <PostText> {route.params.data.input_text}</PostText>
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
          <Interaction
            onPress={() => {
              handleLike(
                kakaoUid,
                route.params.data.post_seq,
                route.params.data.likeNy,
              );
            }}>
            {route.params.data.likeNy ? (
              <Ionicons name="heart" color="red" size={25} />
            ) : (
              <Ionicons name="heart-outline" size={25} />
            )}
            <InteractionText>
              Like ({route.params.data.like_count})
            </InteractionText>
          </Interaction>
          <Interaction>
            <Ionicons name="md-chatbubble-outline" size={25} />
            <InteractionText>
              Comment (
              {postComments
                ? postComments.length
                : route.params.data.commentCount}
              )
            </InteractionText>
          </Interaction>
        </InterContainer>
        <Divider />
        {!commentsLoading && (
          <CommentList
            data={postComments}
            horizontal={false}
            keyExtractor={item => item.comment_seq + ''}
            renderItem={({item}) => (
              <CommentsContainer>
                <CommentWrapper>
                  <CommentUser source={{uri: item.profileImg}} />
                  <CommentBox>
                    <UserText>{item.nickname}</UserText>
                    <CommentText>{item.comment}</CommentText>
                  </CommentBox>
                  <PostTime>{getPostTime(item.reg_time)}</PostTime>

                  {kakaoUid === item.kakao_user_number + '' ? (
                    <Ionicons
                      onPress={async () => {
                        Alert.alert('댓글 삭제', '댓글을 삭제하시겠습니까?', [
                          {text: 'Cancel'},
                          {
                            text: 'OK',
                            onPress: () => {
                              deleteComment(item.comment_seq);
                              commentMutation.mutate();
                            },
                          },
                        ]);
                      }}
                      name="ellipsis-horizontal"
                      size={25}
                    />
                  ) : null}
                </CommentWrapper>
              </CommentsContainer>
            )}
          />
        )}
        <CommentInputContainer>
          <CommentInput
            multiline={true}
            placeholder="댓글을 입력해주세요"
            value={comment}
            onChangeText={text => setComment(text)}
          />
          <PostBtn
            onPress={() => {
              uploadComment(kakaoUid, route.params.data.post_seq, comment);
              setComment('');
              commentMutation.mutate();
            }}>
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

const UserWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const UserInfo = styled.TouchableOpacity`
  flex-direction: row;
  padding: 10px;
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

const CommentList = styled.FlatList`
  width: 90%;
`;

const CommentsContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin: 4px 0;
  padding: 4px;
`;
const CommentWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const CommentUser = styled.Image`
  width: 40;
  height: 40;
  border-radius: 20px;
  margin-right: 8px;
`;
const CommentBox = styled.View``;
const UserText = styled.Text`
  font-size: 12px;
`;
const CommentText = styled.Text`
  font-size: 10px;
  margin-top: 2px;
`;

export default CommunityPost;
