import axios from 'axios';
import Config from 'react-native-config';

const BASE_URL = Config.BASE_URL;

export const deleteMusic = async (favoriteSongSeq, kakaoUid) => {
  try {
    await axios.delete(`${BASE_URL}/users/favorite-songs`, {
      data: {
        favoriteSongSeq: favoriteSongSeq,
        key: kakaoUid,
      },
    });
  } catch {
    err => console.log(err);
  }
};

export const addMusic = async (kakaoUid, route, artistUri) => {
  try {
    await axios
      .post(`${BASE_URL}/users/favorite-songs`, {
        key: kakaoUid,
        musicUri: route.params.musicUri,
        albumTitle: route.params.albumTitle,
        albumImg: route.params.albumImg,
        albumArtistName: route.params.albumArtistName,
        artistUri: artistUri,
      })
      .then(res => {
        if (res.data === 'error') {
          alert('이미 등록된 노래입니다!');
        }
      });
  } catch (error) {
    console.log('error: ', error);
  }
};
