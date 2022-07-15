import React from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import getPostTime from '../../functions/getPostTime';
import axios from 'axios';
import {Alert} from 'react-native';
import Swiper from 'react-native-swiper';
import {remote} from 'react-native-spotify-remote';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {checkIsFriend} from '../../api/Friend';
import {useQuery} from 'react-query';
import {deletePost, postLike} from '../../api/Posts';
import sendAlarm from '../../functions/sendAlarm';

const TotalCommunity = ({navigation}) => {
  const BASE_URL = Config.BASE_URL;
  const {kakaoUid} = useSelector(state => state.kakaoUid);
  const {myProfileData} = useSelector(state => state.myProfile);

  // 전체 게시글 가져오기
  const {
    isLoading: totalPostDataLoading,
    data: totalPostDatas,
    refetch,
  } = useQuery('totalPostDatas', async () => {
    const {data} = await axios(`${BASE_URL}/post/total-posts`, {
      params: {
        key: kakaoUid,
      },
    });
    return data;
  });

  return (
    <Container>
      {!totalPostDataLoading && (
        <PostList
          data={totalPostDatas}
          keyExtractor={item => item.post_seq + ''}
          horizontal={false}
          renderItem={({item}) => (
            <Card>
              <UserWrapper>
                <UserInfo
                  onPress={async () => {
                    const flag = await checkIsFriend(
                      kakaoUid,
                      item.kakao_user_number,
                    );
                    if (flag === -1) {
                      navigation.push('TabBar', {screen: 'MyProfile'});
                    } else {
                      navigation.push('Stack', {
                        screen: 'OtherUserProfile',
                        params: {
                          otherUid: item.kakao_user_number,
                          isFriend: flag,
                        },
                      });
                    }
                  }}>
                  <UserImg source={{uri: item.profile_image}} />
                  <UserInfoView>
                    <UserName>{item.nickname}</UserName>
                    <PostTime>{getPostTime(item.reg_time)}</PostTime>
                  </UserInfoView>
                </UserInfo>
                {kakaoUid === item.kakao_user_number + '' ? (
                  <Ionicons
                    onPress={async () => {
                      Alert.alert('게시글 삭제', '게시글을 삭제하시겠습니까?', [
                        {text: 'Cancel'},
                        {
                          text: 'OK',
                          onPress: () => {
                            deletePost(kakaoUid, item.post_seq);
                            refetch();
                          },
                        },
                      ]);
                    }}
                    name="ellipsis-horizontal"
                    size={25}
                  />
                ) : null}
              </UserWrapper>

              {item.album_title || item.image1 ? (
                <>
                  <Swiper height={200} showsButtons={true} loop>
                    {item.album_title ? (
                      <AlbumImgBtn
                        onPress={async () => {
                          await remote.playUri(item.music_uri);
                        }}>
                        <SelectedMusic>
                          {item.album_title} - {item.album_artist_name}
                        </SelectedMusic>
                        <PostImg
                          resizeMode="contain"
                          source={{uri: item.album_image}}
                        />
                      </AlbumImgBtn>
                    ) : null}
                    {item.image1 ? (
                      <ImageContainer>
                        <PostImg
                          resizeMode="cover"
                          source={{uri: item.image1}}
                        />
                      </ImageContainer>
                    ) : null}
                    {item.image2 ? (
                      <ImageContainer>
                        <PostImg
                          resizeMode="cover"
                          source={{uri: item.image2}}
                        />
                      </ImageContainer>
                    ) : null}
                    {item.image3 ? (
                      <ImageContainer>
                        <PostImg
                          resizeMode="cover"
                          source={{uri: item.image3}}
                        />
                      </ImageContainer>
                    ) : null}
                    {item.image4 ? (
                      <ImageContainer>
                        <PostImg
                          resizeMode="cover"
                          source={{uri: item.image4}}
                        />
                      </ImageContainer>
                    ) : null}
                    {item.image5 ? (
                      <ImageContainer>
                        <PostImg
                          resizeMode="cover"
                          source={{uri: item.image5}}
                        />
                      </ImageContainer>
                    ) : null}
                  </Swiper>
                </>
              ) : null}
              <PostText> {item.input_text}</PostText>

              <Divider />
              <InterContainer>
                <Interaction
                  onPress={() => {
                    if (!item.likeNy) {
                      const myData = {
                        uid: myProfileData.kakao_user_number.toString(),
                        nickname: myProfileData.nickname,
                        profile_image: myProfileData.profile_image,
                      };
                      sendAlarm(
                        myData,
                        item,
                        '회원님의 게시물을 좋아합니다',
                        0,
                      );
                    }
                    postLike(kakaoUid, item.post_seq, item.likeNy);
                    refetch();
                  }}>
                  {item.likeNy ? (
                    <Ionicons name="heart" color="red" size={25} />
                  ) : (
                    <Ionicons name="heart-outline" size={25} />
                  )}
                  <InteractionText> Like ({item.like_count})</InteractionText>
                </Interaction>
                <Interaction
                  onPress={() => {
                    console.log('data', item);
                    navigation.push('Stack', {
                      screen: 'CommunityPost',
                      params: {
                        data: item,
                      },
                    });
                  }}>
                  <Ionicons name="md-chatbubble-outline" size={25} />
                  <InteractionText>
                    Comment ({item.commentCount})
                  </InteractionText>
                </Interaction>
              </InterContainer>
            </Card>
          )}
        />
      )}
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

const ImageContainer = styled.TouchableOpacity`
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
`;

export default TotalCommunity;
