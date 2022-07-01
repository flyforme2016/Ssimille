import React, {useState} from 'react';
import styled from 'styled-components/native';
import Swiper from 'react-native-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {remote} from 'react-native-spotify-remote';
import checkIsFriend from '../api/checkIsFriend';
import {useSelector} from 'react-redux';
import getPostTime from '../functions/getPostTime';
import {Alert, View} from 'react-native';
import {deletePost} from '../api/community/deletePost';
import {handleLike} from '../api/community/handleLike';
import Config from 'react-native-config';
import {useQuery} from 'react-query';
import {deleteComment} from '../api/community/deleteComment';
import {uploadComment} from '../api/community/uploadComment';
import axios from 'axios';

const CommunityPost = ({navigation, route}) => {
  const {kakaoUid} = useSelector(state => state.kakaoUid);
  const [comment, setComment] = useState();
  const BASE_URL = Config.BASE_URL;
  console.log(route.params.data);
  const {data: postComments, refetch} = useQuery('postComments', async () => {
    const {data} = await axios(`${BASE_URL}/post/getPostComments`, {
      params: {
        postSeq: route.params.data.post_seq,
      },
    });
    console.log(data);
    return data;
  });

  return (
    <>
      <Container>
        <FlexView>
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
            {route.params.data.album_title || route.params.data.image1 ? (
              <View style={{height: 200}}>
                <Swiper height={300} loop>
                  {route.params.data.album_title ? (
                    <AlbumImgBtn
                      onPress={async () => {
                        console.log('clicked');
                        await remote.playUri(route.params.data.music_uri);
                      }}>
                      <SelectedMusic>
                        {route.params.data.album_title} -
                        {route.params.data.album_artist_name}
                      </SelectedMusic>
                      <PostImg
                        resizeMode="contain"
                        source={{uri: route.params.data.album_image}}
                      />
                    </AlbumImgBtn>
                  ) : null}
                  {route.params.data.image1 ? (
                    <ImageContainer>
                      <PostImg
                        resizeMode="contain"
                        source={{uri: route.params.data.image1}}
                      />
                    </ImageContainer>
                  ) : null}
                  {route.params.data.image2 ? (
                    <ImageContainer>
                      <PostImg
                        resizeMode="contain"
                        source={{uri: route.params.data.image2}}
                      />
                    </ImageContainer>
                  ) : null}
                  {route.params.data.image3 ? (
                    <ImageContainer>
                      <PostImg
                        resizeMode="contain"
                        source={{uri: route.params.data.image3}}
                      />
                    </ImageContainer>
                  ) : null}
                  {route.params.data.image4 ? (
                    <ImageContainer>
                      <PostImg
                        resizeMode="contain"
                        source={{uri: route.params.data.image4}}
                      />
                    </ImageContainer>
                  ) : null}
                  {route.params.data.image5 ? (
                    <ImageContainer>
                      <PostImg
                        resizeMode="contain"
                        source={{uri: route.params.data.image5}}
                      />
                    </ImageContainer>
                  ) : null}
                </Swiper>
              </View>
            ) : null}
            <PostText> {route.params.data.input_text}</PostText>
            <Divider />
            <InterContainer>
              <Interaction
                onPress={() => {
                  handleLike(
                    kakaoUid,
                    route.params.data.post_seq,
                    route.params.data.likeNy,
                  );
                  refetch();
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
              <Interaction
                onPress={() => {
                  console.log('clicked');
                  navigation.push('Stack', {
                    screen: 'PostComments',
                    params: {
                      datas: route.params.data,
                    },
                  });
                }}>
                <Ionicons name="md-chatbubble-outline" size={25} />
                <InteractionText>
                  Comment (
                  {postComments
                    ? postComments.length
                    : route.params.commentCount}
                  )
                </InteractionText>
              </Interaction>
            </InterContainer>
            <Divider />
          </Card>
          {postComments && (
            <CommentList
              nestedScrollEnabled={true}
              data={postComments}
              horizontal={false}
              keyExtractor={item => item.post_seq + ''}
              renderItem={({item}) => (
                <CommentsContainer>
                  <CommentBox>
                    <CommentUser source={{uri: item.profileImg}} />
                    <UserInfoView>
                      <UserName>{item.nickname}</UserName>
                      <CommentText>{item.comment}</CommentText>
                    </UserInfoView>
                  </CommentBox>
                  <DeleteContainer>
                    {kakaoUid === item.kakao_user_number + '' ? (
                      <Ionicons
                        onPress={async () => {
                          Alert.alert('댓글 삭제', '댓글을 삭제하시겠습니까?', [
                            {text: 'Cancel'},
                            {
                              text: 'OK',
                              onPress: () => {
                                deleteComment(item.comment_seq);
                                refetch();
                              },
                            },
                          ]);
                        }}
                        name="ellipsis-horizontal"
                        size={20}
                      />
                    ) : null}
                    <TimeText>{getPostTime(item.reg_time)}</TimeText>
                  </DeleteContainer>
                </CommentsContainer>
              )}
            />
          )}
        </FlexView>
      </Container>
      <CommentInputContainer>
        <CommentInput
          multiline={true}
          autofocus={true}
          placeholder="댓글을 입력해주세요"
          value={comment}
          onChangeText={text => setComment(text)}
        />
        <PostBtn
          onPress={() => {
            uploadComment(kakaoUid, route.params.data.post_seq, comment);
            setComment('');
            const myData = {
              uid: myProfileData.kakao_user_number.toString(),
              nickname: myProfileData.nickname,
              profile_image: myProfileData.profile_image
            }
            sendAlarm(myData, route.params.data, '회원님의 게시물에 댓글을 남겼습니다.', 0)
            refetch();
          }}>
          <Ionicons name="send" size={25} />
        </PostBtn>
      </CommentInputContainer>
    </>
  );
};
const DeleteContainer = styled.View`
  align-items: flex-end;
`;
const TimeText = styled.Text`
  font-size: 10px;
`;
const Container = styled.ScrollView`
  flex: 1;
  height: 100%;
`;
const FlexView = styled.View`
  margin-bottom: 50px;
`;
const CommentList = styled.FlatList`
  margin: 12px;
`;
const CommentsContainer = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin: 4px 0;
  padding: 4px;
`;
const CommentUser = styled.Image`
  width: 40;
  height: 40;
  border-radius: 20px;
`;
const CommentBox = styled.View`
  flex-direction: row;
`;
const CommentText = styled.Text`
  font-size: 12px;
`;
const CommentInputContainer = styled.View`
  background-color: #ffffff;
  position: absolute;
  bottom: 0;
  z-index: 100;
  align-items: center;
  flex-direction: row;
  padding-right: 10px;
`;
const CommentInput = styled.TextInput`
  width: 90%;
  border: 1px solid #dddddd;
  padding: 10px;
  margin-right: 10px;
`;
const PostBtn = styled.TouchableOpacity``;

const Card = styled.View`
  justify-content: center;
  margin-top: 25px;
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
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const PostImg = styled.Image`
  flex: 1;
  width: 200;
  height: 200;
  margin: 5px;
`;
const AlbumImgBtn = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Divider = styled.View`
  border-bottom-color: #dddddd;
  border-bottom-width: 1px;
  width: 90%;
  margin: 8px;
  align-self: center;
`;

const InterContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;
const Interaction = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  border-radius: 5px;
  padding: 2px 5px;
`;
const InteractionText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  margin: 5px;
`;

export default CommunityPost;
