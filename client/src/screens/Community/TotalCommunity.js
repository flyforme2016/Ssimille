import React, {useLayoutEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import getPostTime from '../../functions/getPostTime'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Dimensions} from 'react-native';
import Swiper from 'react-native-swiper';
import {remote} from 'react-native-spotify-remote';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import checkIsFriend from '../../api/checkIsFriend';
const {width} = Dimensions.get('window');

const TotalCommunity = ({navigation}) => {
  const BASE_URL = Config.BASE_URL;

  const [likePress, setLikePress] = useState();
  const [postData, setPostData] = useState();
  const myUid = useSelector(state => state.kakaoUid);
  console.log('myUid in TotalCommunity', myUid);

  const getData = async () => {
    await axios
      .get(`${BASE_URL}/post/getPostList`, {
        params: {
          key: myUid,
        },
      })
      .then(
        res => {
          console.log('postData: ', res.data);
          setPostData(res.data);
        },
        err => {
          console.log('게시글 정보 받아오기 실패', err);
        },
      );
  };

  const handleLike = async (seq, like) => {
    const value = await AsyncStorage.getItem('userNumber');
    await axios
      .post(`${BASE_URL}/post/postLike`, {
        key: value,
        postSeq: postData[seq - 1].post_seq,
        check: !like,
      })
      .then(
        res => {
          console.log('좋아요 수정 성공: ', res.data);
        },
        err => {
          console.log('좋아요 수정하기 실패', err);
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
              onPress={ async () => {
                const flag = await checkIsFriend(myUid, item.kakao_user_number)
                console.log('flag: ', flag)
                if(flag === -1 ){
                  navigation.navigate('TabBar', {screen:'MyProfile'})
                }else{
                  navigation.navigate('Stack', {
                    screen: 'OtherUserProfile',
                    params: {
                      otherUid: item.kakao_user_number,
                      isFriend: flag,
                    },
                  });
                }
              }}>
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

            <InterContainer>
              <Interaction
                onPress={async e => {
                  console.log('e.target', e.target);
                  const seq = item.post_seq;
                  setLikePress(prev => !prev);
                  const like = likePress;
                  console.log(likePress, seq);
                  await handleLike(seq, like);
                }}>
                {likePress ? (
                  <Ionicons name="heart" color="red" size={25} />
                ) : (
                  <Ionicons name="heart-outline" size={25} />
                )}
                <InteractionText> Like ({item.like_count})</InteractionText>
              </Interaction>
              <Interaction
                onPress={() => {
                  navigation.navigate('Stack', {
                    screen: 'CommunityPost',
                    params: {
                      post_seq: item.post_seq,
                      kakao_user_id: item.kakao_user_number,
                      profileImg: item.profileImg,
                      nickname: item.nickname,
                      input_text: item.input_text,
                      like_count: item.like_count,
                      albumTitle: item.album_title,
                      albumArtistName: item.album_artist_name,
                      albumImg: item.album_image,
                      musicUri: item.music_uri,
                      commentCount: item.commentCount,
                      likeNy: item.likeNy,
                    },
                  });
                }}>
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

export default TotalCommunity;
