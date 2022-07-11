import axios from 'axios';
import Config from 'react-native-config';

const BASE_URL = Config.BASE_URL;

export const handleLike = async (kakaoUid, seq, like) => {
  try {
    await axios.post(`${BASE_URL}/post/like`, {
      key: kakaoUid,
      postSeq: seq,
      check: !like,
    });
  } catch {
    err => console.log(err);
  }
};
