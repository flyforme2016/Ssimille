import React from 'react';
import {Dimensions} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {useQuery} from 'react-query';
import Config from 'react-native-config';
import axios from 'axios';

const {width} = Dimensions.get('window');

const GridPosts = ({navigation}) => {
  const BASE_URL = Config.BASE_URL;
  const {kakaoUid} = useSelector(state => state.kakaoUid);

  //내 게시글 가져오기
  const {isLoading: postDataLoading, data: postDatas} = useQuery(
    'myPostDatas',
    async () => {
      const {data} = await axios(`${BASE_URL}/post/getMyPost`, {
        params: {
          key: kakaoUid,
        },
      });
      return data;
    },
  );
  return (
    <GridList>
      <Container>
        {!postDataLoading &&
          postDatas.map(item => {
            return (
              <Post
                width={width}
                // onPress={navigation.push('Stack', {
                //   screen: 'CommunityPost',
                //   params: {
                //     post_seq: item.post_seq,
                //     kakao_user_id: item.kakao_user_number,
                //     profileImg: item.profileImg,
                //     nickname: item.nickname,
                //     input_text: item.input_text,
                //     like_count: item.like_count,
                //     albumTitle: item.album_title,
                //     albumArtistName: item.album_artist_name,
                //     albumImg: item.album_image,
                //     musicUri: item.music_uri,
                //     commentCount: item.commentCount,
                //     likeNy: item.likeNy,
                //   },
                // })}>
              >
                {item.album_image ? (
                  <PostImg width={width} source={{uri: item.album_image}} />
                ) : (
                  <PostText>{item.input_text}</PostText>
                )}
              </Post>
            );
          })}
      </Container>
    </GridList>
  );
};

const GridList = styled.ScrollView`
  flex: 1;
  background-color: #ffffff;
`;
const Container = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;
const Post = styled.TouchableOpacity`
  width: ${({width}) => (width - 5) / 3};
  background-color: #b7b4df;
  align-items: center;
  justify-content: center;
  border: 0.5px solid #ffffff;
`;

const PostText = styled.Text`
  font-size: 20px;
`;
const PostImg = styled.Image`
  width: ${({width}) => (width - 5) / 3};
  height: ${({width}) => (width - 5) / 3};
`;

export default GridPosts;
