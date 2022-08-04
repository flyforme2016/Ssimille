import axios from 'axios';
import Config from 'react-native-config';

const BASE_URL = Config.BASE_URL;

export const uploadComment = async (kakaoUid, postSeq, comment) => {
  try {
    await axios.post(`${BASE_URL}/post/post-comments`, {
      key: kakaoUid,
      postSeq: postSeq,
      comment: comment,
    });
  } catch {
    err => console.log(err);
  }
};

export const deleteComment = async commentSeq => {
  try {
    await axios.delete(`${BASE_URL}/post/post-comments`, {
      data: {
        commentSeq: commentSeq,
      },
    });
  } catch {
    err => console.log(err);
  }
};
