import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';

//현재 위치 가져오는 함수
export const getCurrentLocation = async () => {
  // 위치 권한 허용 확인
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('권한 얻기 성공');
    //위도 & 경도 불러오는 함수
    Geolocation.getCurrentPosition(
      async position => {
        return position.coords;
      },
      error => {
        console.log(error.message);
      },
      {enableHighAccuracy: true, timeout: 15000},
    ).catch(err => console.log('위치정보 얻기 실패 :', err));
  }
};
