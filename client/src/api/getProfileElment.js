import axios from 'axios';
import Config from 'react-native-config';

const BASE_URL = Config.BASE_URL;

export const getProfileElment = async kakaoUid => {
  try {
    console.log('start getProfileElement');
    if (kakaoUid !== null) {
      await axios
        .get(`${BASE_URL}/profile/getUserProfile`, {
          params: {
            key: kakaoUid,
          },
        })
        .then(res => {
          console.log('res: ', res.data);
        });
    }
  } catch (error) {
    console.log('error: ', error);
  }
};
