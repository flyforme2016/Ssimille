import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Alert} from 'react-native';
import axios from 'axios';
import Config from 'react-native-config';
import {useQuery, useMutation} from 'react-query';
import checkIsFriend from '../api/checkIsFriend';
import {deletePost} from '../api/community/deletePost';
import {deleteComment} from '../api/community/deleteComment';
import {uploadComment} from '../api/community/uploadComment';
import getPostTime from '../functions/getPostTime';
import {
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

const PostComments = ({navigation, route}) => {
  const {kakaoUid} = useSelector(state => state.kakaoUid);
  const [comment, setComment] = useState();
  const BASE_URL = Config.BASE_URL;
  console.log(' post comments', route.params.data);

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
        console.log('res', res);
      },
    },
  );

  const commentMutation = useMutation(async () => {
    refetch();
  });

  return (
    <Container>
      <Card>
        <UserInfo
          onPress={async () => {
            const flag = await checkIsFriend(
              kakaoUid,
              route.params.datas.kakao_user_number,
            );
            console.log('flag: ', flag);
            if (flag === -1) {
              navigation.navigate('TabBar', {screen: 'MyProfile'});
            } else {
              navigation.navigate('Stack', {
                screen: 'OtherUserProfile',
                params: {
                  otherUid: route.params.datas.kakao_user_number,
                  isFriend: flag,
                },
              });
            }
          }}>
          <UserImg source={{uri: route.params.datas.profile_image}} />
          <UserInfoView>
            <UserName>{route.params.datas.nickname}</UserName>
            <PostTime>{getPostTime(route.params.datas.reg_time)}</PostTime>
          </UserInfoView>
        </UserInfo>
        {kakaoUid === route.params.datas.kakao_user_number + '' ? (
          <Ionicons
            onPress={async () => {
              Alert.alert('게시글 삭제', '게시글을 삭제하시겠습니까?', [
                {text: 'Cancel'},
                {
                  text: 'OK',
                  onPress: () => {
                    deletePost(kakaoUid, route.params.datas.post_seq);
                    // 프로필 or 전체 게시글로 다시 돌아감
                    navigation.goBack();
                  },
                },
              ]);
            }}
            name="ellipsis-horizontal"
            size={20}
          />
        ) : null}
      </Card>
      <PostText> {route.params.datas.input_text}</PostText>
      <Divider />
      {postComments && (
        <CommentList
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
                  size={20}
                />
              ) : null}
            </CommentsContainer>
          )}
        />
      )}
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
            uploadComment(kakaoUid, route.params.datas.post_seq, comment);
            setComment('');
            commentMutation.mutate();
          }}>
          <Ionicons name="send" size={25} />
        </PostBtn>
      </CommentInputContainer>
    </Container>
  );
};

const Container = styled.ScrollView`
  flex: 1;
  position: absolute;
`;

const Card = styled.View`
  margin: 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const Divider = styled.View`
  border-bottom-color: #dddddd;
  border-bottom-width: 1px;
  width: 90%;
  margin-top: 15px;
  align-self: center;
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
  justify-content: center;
  margin-left: 10px;
`;

const UserName = styled.Text`
  font-size: 12px;
  font-weight: bold;
`;
const PostTime = styled.Text`
  font-size: 10px;
  color: #666;
`;
const PostText = styled.Text`
  font-size: 14px;
  padding: 0 15px;
`;
const CommentList = styled.FlatList`
  height: 60%;
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
  font-size: 10px;
  margin-top: 2px;
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

export default PostComments;
