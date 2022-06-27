import axios from 'axios';
import Config from 'react-native-config';

const BASE_URL = Config.BASE_URL;

export const deletePost = async (kakaoUid, seq) => {
  try {
    await axios.delete(`${BASE_URL}/post/deletePost`, {
      data: {key: kakaoUid, postSeq: seq},
    });
  } catch {
    err => console.log(err);
  }
};
