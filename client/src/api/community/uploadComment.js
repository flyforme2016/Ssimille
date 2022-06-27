import axios from 'axios';
import Config from 'react-native-config';

const BASE_URL = Config.BASE_URL;

export const uploadComment = async (kakaoUid, postSeq, comment) => {
  try {
    await axios
      .post(`${BASE_URL}/post/inputPostComment`, {
        key: kakaoUid,
        postSeq: postSeq,
        comment: comment,
      })
      .then(result => {
        console.log(result, '업로드 완료');
      });
  } catch {
    err => console.log(err);
  }
};
