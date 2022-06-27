import React from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Alert} from 'react-native';
import {deleteComment} from '../api/community/deleteComment';
import {useMutation, useQuery} from 'react-query';
import axios from 'axios';
import Config from 'react-native-config';
const BASE_URL = Config.BASE_URL;

const PostComments = ({data, keyExtractor}) => {
  const {kakaoUid} = useSelector(state => state.kakaoUid);

  return (
    <CommentList
      data={data}
      horizontal={false}
      keyExtractor={keyExtractor}
      renderItem={({item}) => (
        <CommentsContainer>
          <CommentUser source={{uri: item.profileImg}} />
          <CommentBox>
            <UserText>{item.nickname}</UserText>
            <CommentText>{item.comment}</CommentText>
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
                    },
                  },
                ]);
              }}
              name="ellipsis-horizontal"
              size={25}
            />
          ) : null}
        </CommentsContainer>
      )}
    />
  );
};

const CommentList = styled.FlatList``;

const CommentsContainer = styled.View`
  align-items: center;
  flex-direction: row;
  margin: 4px 0;
  padding: 4px;
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

export default PostComments;
