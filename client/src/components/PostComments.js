import React, {useState} from 'react';
import styled from 'styled-components/native';

const PostComments = ({data, keyExtractor}) => {
  const [visible, setVisible] = useState();

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
            <CommentText>{item.comment_seq}</CommentText>
          </CommentBox>
          <RecommentBtn
            onPress={() => {
              const clicked = item.comment_seq;
              console.log('clicked', clicked);
              setVisible(prev => !prev);
            }}>
            <RecommnetText>
              {item.del_ny ? '답글보기'(item.del_ny) : '답글달기'}
            </RecommnetText>
          </RecommentBtn>
          {visible &&
            // <RecommentList
            //   clicked={clicked}
            //   data={data.filter(content => content.parent === clicked)}
            //   horizontal={false}
            //   keyExtractor={res => res.comment_seq + ''}
            //   renderItem={({res}) => (
            //     <CommentsContainer>
            //       <CommentUser source={{uri: res.profileImg}} />
            //       <CommentBox>
            //         <UserText>{res.nickname}</UserText>
            //         <CommentText>{res.comment}</CommentText>
            //       </CommentBox>
            //     </CommentsContainer>
            //   )}
            // />
            data
              .filter(content => content.parent === 0)
              .map(items => {
                return (
                  <RecommentContainer>
                    <CommentUser source={{uri: items.profileImg}} />
                    <CommentBox>
                      <UserText>{items.nickname}</UserText>
                      <CommentText>{items.comment}</CommentText>
                    </CommentBox>
                  </RecommentContainer>
                );
              })}
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
const RecommentContainer = styled.View`
  background-color: tomato;

  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 20px;
`;
const RecommentBtn = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  margin: 8px;
  padding: 3px;
`;
const RecommnetText = styled.Text`
  font-size: 8px;
`;
export default PostComments;
