import React, {useLayoutEffect, useState} from 'react';
import getPostTime from '../../api/getPostTime';
import Swiper from 'react-native-swiper';
import styled from 'styled-components/native';
import getSpotifyToken from '../../api/getSpotifyToken';
import {remote} from 'react-native-spotify-remote';
import axios from 'axios';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';

const PostList = ({navigation}) => {
  const myUid = useSelector(state => state.kakaoUid);
  const [postData, setPostData] = useState();
  const BASE_URL = Config.BASE_URL;

  const getData = async () => {
    await axios
      .get(`${BASE_URL}/post/getMyPost`, {
        params: {
          key: myUid.kakaoUid,
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
      <MyPostList
        data={postData}
        keyExtractor={item => item.post_seq + ''}
        horizontal={false}
        renderItem={({item}) => (
          <Card>
            <UserInfo>
              <UserImg source={{uri: item.profileImg}} />
              <UserInfoView>
                <UserName>{item.nickname}</UserName>
                <PostTime>{getPostTime(item.reg_time)}</PostTime>
              </UserInfoView>
            </UserInfo>
            <Divider />

            <Swiper height={200} loadMinimal={true} showsButtons={true} loop>
              <AlbumImgBtn
                onPress={async () => {
                  await getSpotifyToken();
                  await remote.playUri(item.music_uri);
                }}>
                <SelectedMusic>
                  {item.album_title} - {item.album_artist_name}
                </SelectedMusic>
                <PostImg resizeMode="cover" source={{uri: item.album_image}} />
              </AlbumImgBtn>
              <ImageContainer>
                <PostImg resizeMode="cover" source={{uri: item.image1}} />
              </ImageContainer>
              <ImageContainer>
                <PostImg resizeMode="cover" source={{uri: item.image2}} />
              </ImageContainer>
              <ImageContainer>
                <PostImg resizeMode="cover" source={{uri: item.image3}} />
              </ImageContainer>
              <ImageContainer>
                <PostImg resizeMode="cover" source={{uri: item.image4}} />
              </ImageContainer>
              <ImageContainer>
                <PostImg resizeMode="cover" source={{uri: item.image5}} />
              </ImageContainer>
            </Swiper>
            <Divider />
            <PostText> {item.input_text}</PostText>
          </Card>
        )}
      />
    </Container>
  );
};

const Container = styled.View`
  align-items: center;
`;

const MyPostList = styled.FlatList`
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
  margin-top: 12px;
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
  //color: ${props => (props.active ? '#2e64e5' : '#333')};
`;

export default PostList;
