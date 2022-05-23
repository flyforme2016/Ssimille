import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {PermissionsAndroid} from 'react-native';

export const getLocationName = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
      headers: {
        Host: 'dapi.kakao.com',
        Authorization: 'KakaoAK 1c1252b4d425329642c458690fe99854',
        'Content-Type': 'application/json;',
      },
    });
    const currentInfo = res.data.documents[0];
    //console.log(currentInfo);
    return currentInfo;
  } catch (error) {
    return error;
  }
};
