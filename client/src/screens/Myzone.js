import React, {useEffect, useState} from 'react';
import Styled from 'styled-components/native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';
import axios from 'axios';

const Myzone = () => {
  const [location, setLocation] = useState(false);
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [locationName, setLocationName] = useState('위치 확인중');
  const getCurrentLocation = async () => {
    // 위치 권한 허용 확인
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('권한 얻기 성공');
      //위도 & 경도 불러오는 함수
      Geolocation.getCurrentPosition(
        position => {
          const x = position.coords.longitude;
          const y = position.coords.latitude;
          setLongitude(x);
          setLatitude(y);
          setLocation(true);
        },
        error => {
          console.log(error.message);
        },
        {enableHighAccuracy: true, timeout: 15000},
      );
    } else {
      console.log('권한얻기 실패 :', granted);
    }
  };

  // 현재위치를 행정동으로 바꿔주는 함수

  const getLocationName = async () => {
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
      setLocationName(currentInfo.address_name);
      //console.log(currentInfo);
      return currentInfo;
    } catch (error) {
      return error;
    }
  };
  getCurrentLocation();
  getLocationName();

  return (
    <Container>
      {location && (
        <MapView
          style={{flex: 1}}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onRegionChange={region => {
            setLongitude(region.longitude);
            setLatitude(region.latitude);
          }}>
          <Marker
            coordinate={{
              latitude: latitude,
              longitude: longitude,
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
