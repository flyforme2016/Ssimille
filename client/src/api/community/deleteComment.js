import axios from 'axios';
import Config from 'react-native-config';

const BASE_URL = Config.BASE_URL;

export const deleteComment = async commentSeq => {
  try {
    await axios
      .delete(`${BASE_URL}/post/deletePostComment`, {
        data: {
          commentSeq: commentSeq,
        },
      })
      .then(result => {
        console.log(result, '삭제 완료');
      });
  } catch {
    err => console.log(err);
  }
};
