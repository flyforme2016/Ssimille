/* eslint-disable prettier/prettier */

import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';

export const getCurrentLocation = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('권한 얻기 성공');
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
      },
      error => {
        console.log(error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  } else {
    console.log('권한얻기 실패 :', granted);
  }
};

export default getCurrentLocation;
