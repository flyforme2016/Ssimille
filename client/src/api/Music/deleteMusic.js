import axios from 'axios';
import Config from 'react-native-config';

const BASE_URL = Config.BASE_URL;

export const deleteMusic = async (favoriteSongSeq, kakaoUid) => {
  try {
    await axios
      .delete(`${BASE_URL}/profile/removeFavoriteSong`, {
        data: {
          favoriteSongSeq: favoriteSongSeq,
          key: kakaoUid,
        },
      })
      .then(result => {
        console.log(result, '삭제 완료');
      });
  } catch {
    err => console.log(err);
  }
};
