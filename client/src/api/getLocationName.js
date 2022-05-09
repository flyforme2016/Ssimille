/* eslint-disable prettier/prettier */
import axios from 'axios';

// 현재위치를 행정동으로 바꿔주는 함수
const getLocationName = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x= 126.9766&y=37.5629',
      headers: {
        Host: 'dapi.kakao.com',
        Authorization: 'KakaoAK 1c1252b4d425329642c458690fe99854',
        'Content-Type': 'application/json;',
      },
    });
    return res.data.documents[0];
  } catch (error) {
    return error;
  }
};

export default getLocationName;
