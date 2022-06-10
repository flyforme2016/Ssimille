import React, {useEffect, useState} from 'react';
import Styled from 'styled-components/native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

import axios from 'axios';
import {getCurrentLocation} from '../api/getCurrentLocation';

const Myzone = () => {
  const [location, setLocation] = useState({longitude: '', latitude: ''});
  const [locationName, setLocationName] = useState('위치 확인중');
  useEffect(() => {
    const testLocation = async () => {
      await getCurrentLocation().then(async result => {
        await setLocation(result);
        console.log(result);
      });
    };
    testLocation();
    getLocationName();
  });
  // //현재 위치 가져오는 함수
  // const getCurrentLocation = async () => {
  //   // 위치 권한 허용 확인
  //   const granted = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //   );
  //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //     console.log('권한 얻기 성공');
  //     //위도 & 경도 불러오는 함수
  //     Geolocation.getCurrentPosition(
  //       async position => {
  //         await setLocation([
  //           position.coords.longitude,
  //           position.coords.latitude,
  //         ]);
  //       },
  //       error => {
  //         console.log(error.message);
  //       },
  //       {enableHighAccuracy: true, timeout: 15000},
  //     ).catch(err => console.log('위치정보 얻기 실패 :', err));
  //     console.log(location);
  //   }
  // };

  // 현재위치를 행정동으로 바꿔주는 함수
  const getLocationName = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${location[0]}&y=${location[1]}`,
        headers: {
          Host: 'dapi.kakao.com',
          Authorization: 'KakaoAK 1c1252b4d425329642c458690fe99854',
          'Content-Type': 'application/json;',
        },
      });
      const currentInfo = res.data.documents[0];
      setLocationName(currentInfo.address_name);
      return currentInfo;
    } catch (error) {
      return error;
    }
  };

  return (
    <Container>
      {location && (
        <MapView
          style={{flex: 1}}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location[1],
            longitude: location[0],
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{
              latitude: location[1],
              longitude: location[0],
            }}
          />
          <Label>{locationName}</Label>
        </MapView>
      )}
    </Container>
  );
};

const Container = Styled.View`
  flex: 1;
`;
const Label = Styled.Text`
  font-size: 26px;
`;

export default Myzone;
