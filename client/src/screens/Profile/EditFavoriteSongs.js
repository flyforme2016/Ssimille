import React, {useState} from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import axios from 'axios';
import Config from 'react-native-config';
import {useQuery} from 'react-query';
import Modal from 'react-native-modal';
import {getArtistUri} from '../../functions/getArtistUri';
import {addMusic, deleteMusic} from '../../api/Music';

const SPOTIFY_CLIENT_ID = Config.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = Config.SPOTIFY_CLIENT_SECRET;
const BASE_URL = Config.BASE_URL;

const SpotifyWebApi = require('spotify-web-api-node');
const spotifyWebApi = new SpotifyWebApi({
  clientID: `${SPOTIFY_CLIENT_ID}`,
  clientSecret: `${SPOTIFY_CLIENT_SECRET}`,
  redirectURL: `${BASE_URL}/spotify/oauth/callback`,
});

const EditFavoriteSongs = ({navigation, route}) => {
  const {kakaoUid} = useSelector(state => state.kakaoUid);
  const {myProfileData} = useSelector(state => state.myProfile);
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const {myGenres} = useSelector(state => state.myGenres);
  const {spotifyToken} = useSelector(state => state.spotifyToken);
  const songGenres = {};

  const {
    isLoading,
    data: favSongDatas,
    refetch,
  } = useQuery('favSongDatas', async () => {
    const {data} = await axios(`${BASE_URL}/users/favorite-songs`, {
      params: {
        key: kakaoUid,
      },
    });
    return data;
  });

  const postFavoriteSongs = async uri => {
    const artistUri = getArtistUri(uri);
    await addMusic(kakaoUid, route, artistUri);
  };

  const postSongGenres = async uri => {
    const artistUri = getArtistUri(uri);

    await spotifyWebApi.setAccessToken(spotifyToken);
    await spotifyWebApi.getArtist(artistUri).then(data => {
      data.body.genres.map(genre => {
        if (genre in myGenres) {
          songGenres[genre] = myGenres[genre] + 1;
          myGenres[genre] += 1;
        }
      });
    });
    try {
      await axios
        .put(`${BASE_URL}/users/genre-matrix`, {
          key: kakaoUid,
          genreMatrixObj: songGenres,
        })
        .then(console.log('업로드 완료'));
    } catch (error) {
      console.log('error: ', error);
    }
  };
  return (
    <Container>
      <MusicUploadBtn
        onPress={async () => {
          setVisible(true);
          navigation.navigate('Stack', {
            screen: 'SearchMusic',
            params: {
              page: 'EditFavoriteSongs',
            },
          });
        }}>
        <Ionicons name="add" size={25} />
      </MusicUploadBtn>

      {/* 새로 추가할 애청곡 */}
      {visible && route?.params ? (
        <MusicInfoContainer>
          <MusicWrapper>
            <CoverImg source={{uri: route.params.albumImg}} />
            <MusicInfo>
              <MusicName>{route.params.albumTitle}</MusicName>
              <ArtistName>{route.params.albumArtistName}</ArtistName>
            </MusicInfo>
          </MusicWrapper>
          <SubmitBtn
            onPress={async () => {
              postFavoriteSongs(route.params.artistUri);
              postSongGenres(route.params.artistUri);
              setVisible(false);
              refetch();

              myProfileData.song_count += 1;
            }}>
            <BtnText>추가하기</BtnText>
          </SubmitBtn>
        </MusicInfoContainer>
      ) : null}
      <Divider />

      {/* 기존 애청곡 */}
      {!isLoading ? (
        <MusicResultList
          data={favSongDatas}
          keyExtractor={item => item.id + ''}
          horizontal={false}
          renderItem={({item}) => (
            <>
              <Card
                onLongPress={() => {
                  setModalVisible(true);
                }}>
                <MusicInfoContainer>
                  <MusicWrapper>
                    <CoverImg source={{uri: item.album_image}} />
                    <MusicInfo>
                      <MusicName>{item.album_title}</MusicName>
                      <ArtistName>{item.album_artist_name}</ArtistName>
                    </MusicInfo>
                  </MusicWrapper>
                </MusicInfoContainer>
              </Card>
              <Modal
                onBackButtonPress={() => setModalVisible(false)}
                isVisible={modalVisible}
                useNativeDriver={true}
                hideModalContentWhileAnimating={true}
                style={{flex: 1, justifyContent: 'flex-end'}}>
                <ModalContentsWrapper>
                  <ModalButton
                    onPress={() => {
                      deleteMusic(item.favorite_song_seq, kakaoUid);
                      refetch();
                      setModalVisible(false);

                      myProfileData.song_count -= 1;
                    }}>
                    <TrashImage
                      source={require('../../assets/sample/trashCan.png')}
                    />
                    <ModalText>삭제</ModalText>
                  </ModalButton>
                </ModalContentsWrapper>
              </Modal>
            </>
          )}
        />
      ) : null}
    </Container>
  );
};
const ModalContentsWrapper = styled.View`
  flex-direction: row;
`;

const ModalButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  height: 70;
  justify-content: center;
  align-items: center;
  background-color: white;
  border: 1px white;
  border-radius: 10px;
  margin: 30px;
  margin-bottom: 10px;
`;

const TrashImage = styled.Image`
  width: 30px;
  height: 30px;
`;

const ModalText = styled.Text`
  color: red;
  font-size: 15px;
`;
const Container = styled.View`
  flex: 1;
`;

const Divider = styled.View`
  border-bottom-color: #dddddd;
  border-bottom-width: 1px;
  width: 90%;
  align-self: center;
  margin: 8px;
`;
const MusicUploadBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  margin-top: 8px;
`;

const MusicResultList = styled.FlatList``;

const Card = styled.TouchableHighlight`
  background-color: #ffffff;
  justify-content: space-between;
  border-radius: 10px;
  margin: 5px 10px;
  elevation: 3;
`;

const MusicInfoContainer = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px;
`;

const MusicWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const CoverImg = styled.Image`
  width: 30px;
  height: 30px;
`;
const MusicInfo = styled.View`
  flex-direction: column;
  justify-content: center;
  margin: 7px;
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

export default EditFavoriteSongs;
