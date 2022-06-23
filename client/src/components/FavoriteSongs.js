import React, {useLayoutEffect, useState} from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {remote} from 'react-native-spotify-remote';
import {MusicControlBtn} from './MusicControlBtn';
import {useSelector} from 'react-redux';
import axios from 'axios';
import Config from 'react-native-config';

const FavoriteSongs = ({navigation, route}) => {
  const BASE_URL = Config.BASE_URL;

  const {kakaoUid} = useSelector(state => state.kakaoUid);
  const [data, setData] = useState();

  useLayoutEffect(() => {
    getFavoriteSongs();
  }, []);

  const getFavoriteSongs = async () => {
    try {
      console.log('myUid: ', kakaoUid);
      await axios
        .get(`${BASE_URL}profile/getUserSongList`, {
          params: {
            key: kakaoUid,
          },
        })
        .then(res => {
          console.log('res: ', res.data);
          if (res.data.status === 200) alert('이미 등록된 노래입니다.');
          else setData(res.data);
        });
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const postFavoriteSongs = async () => {
    try {
      console.log('myUid: ', kakaoUid);
      await axios
        .post(`${BASE_URL}/profile/addFavoriteSong`, {
          key: kakaoUid,
          musicUri: route.params.musicUri,
          albumTitle: route.params.albumTitle,
          albumImg: route.params.albumImg,
          albumArtistName: route.params.albumArtistName,
        })
        .then(res => {
          console.log('성공', res);
        });
    } catch (error) {
      console.log('error: ', error);
    }
  };
  return (
    <Container>
      <NavBar>
        <MusicUploadBtn
          onPress={async () => {
            console.log('clicked');
            navigation.navigate('Stack', {
              screen: 'SearchMusic',
              params: {
                page: 'FavoriteSongs',
              },
            });
          }}>
          <Ionicons name="add" size={25} />
        </MusicUploadBtn>
      </NavBar>
      {/* 새로 추가할 애청곡 */}
      {route.params ? (
        <MusicInfoContainer>
          <MusicWrapper>
            <CoverImg source={{uri: route.params.albumImg}} />
            <MusicInfo>
              <MusicName>{route.params.albumTitle}</MusicName>
              <ArtistName>{route.params.albumArtistName}</ArtistName>
            </MusicInfo>
          </MusicWrapper>
          <SubmitBtn onPress={postFavoriteSongs}>
            <BtnText>추가하기</BtnText>
          </SubmitBtn>
        </MusicInfoContainer>
      ) : null}
      <Divider />

      {/* 기존 애청곡 */}
      <MusicResultList
        data={data}
        keyExtractor={item => item.id + ''}
        horizontal={false}
        renderItem={({item}) => (
          <Card>
            <MusicInfoContainer>
              <MusicWrapper>
                <CoverImg source={{uri: item.album_image}} />
                <MusicInfo>
                  <MusicName>{item.album_title}</MusicName>
                  <ArtistName>{item.album_artist_name}</ArtistName>
                </MusicInfo>
              </MusicWrapper>
              <MusicControlBtn
                onPress={async () => {
                  await remote.playUri(item.music_uri);
                }}
                type="play"
              />
            </MusicInfoContainer>
          </Card>
        )}
      />
    </Container>
  );
};
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const NavBar = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Divider = styled.View`
  border-bottom-color: #dddddd;
  border-bottom-width: 1px;
  width: 90%;
  align-self: center;
  margin: 8px;
`;
const MusicUploadBtn = styled.TouchableOpacity`
  margin-top: 8px;
`;

const MusicResultList = styled.FlatList``;

const Card = styled.View`
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
  margin: 5px 20px;
  border-radius: 10px;
  elevation: 3;
`;

const MusicInfoContainer = styled.TouchableOpacity`
  width: 80%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-content: space-around;
  padding: 12px;
`;

const MusicWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 8px;
`;
const CoverImg = styled.Image`
  width: 50px;
  height: 50px;
`;
const MusicInfo = styled.View`
  flex-direction: column;
  justify-content: center;
  margin: 0 15px;
`;
const SubmitBtn = styled.TouchableOpacity`
  border: 1px solid gray;
  border-radius: 12px;
  padding: 8px;
`;
const BtnText = styled.Text`
  font-size: 12px;
`;
const MusicName = styled.Text`
  font-size: 14px;
  font-weight: bold;
`;

const ArtistName = styled.Text`
  font-size: 12px;
`;

export default FavoriteSongs;
