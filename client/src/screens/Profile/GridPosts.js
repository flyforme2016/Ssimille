import React from 'react';
import {Dimensions} from 'react-native';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {useQuery} from 'react-query';
import Config from 'react-native-config';
import axios from 'axios';

const {width} = Dimensions.get('window');

const GridPosts = ({navigation, userId}) => {
  const BASE_URL = Config.BASE_URL;
  //내 게시글 가져오기
  const {isLoading: postDataLoading, data: postDatas} = useQuery(
    'myPostDatas',
    async () => {
      const {data} = await axios(`${BASE_URL}/post/getMyPost`, {
        params: {
          key: userId,
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
                onPress={() => {
                  navigation.push('Stack', {
                    screen: 'CommunityPost',
                    params: {
                      data: item,
                    },
                  });
                }}>
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
  height: ${({width}) => (width - 5) / 3};
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
