/* eslint-disable prettier/prettier */

import React, {useEffect, useState} from 'react';
import Styled from 'styled-components/native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';
import axios from 'axios';

const API_KEY = ' 1c1252b4d425329642c458690fe99854';
const Myzone = () => {
  const [location, setLocation] = useState();
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
          const {latitude, longitude} = position.coords;
          setLocation({
            latitude,
            longitude,
          });
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
      const response = await axios({
        method: 'GET',
        url: 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x= 126.9766&y=37.5629',
        headers: {
          Host: 'dapi.kakao.com',
          Authorization: 'KakaoAK 1c1252b4d425329642c458690fe99854',
          'Content-Type': 'application/json;',
        },
      })
        // try {
        //   const response = await axios({
        //     method: 'get',
        //     headers: {
        //       Authorization: `KakaoAK 1c1252b4d425329642c458690fe99854`,
        //     },
        //     url: 'https://dapi.kakao.com//v2/local/search/address.json?x=37&y=126',
        //   })
        //   .get(
        //     'http://dapi.kakao.com//v2/local/search/address.${JSON}',
        //     // 'http://api.vworld.kr/req/data?request=GetFeature&data=LT_C_ADEMD_INFO&key=1A792DA1-27F3-3BC7-A9CE-53F0251138C2&geomFilter=point(14132749.177031 4494202.5212524)&crs=EPSG:900913&geometry=false',
        //   )
        .then(res => {
          const data = res.data.documents[0];
          console.log(res.data.documents[0]);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentLocation();
    getLocationName();
  }, []);

  return (
    <Container>
      {location && (
        <MapView
          style={{flex: 1}}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onRegionChange={region => {
            setLocation({
              latitude: region.latitude,
              longitude: region.longitude,
            });
          }}>
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          />
          <Label>{location.latitude}</Label>
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
const Btn = Styled.TouchableOpacity`
  border: 2px solid gray;
  width: 100;
  height: 30;
`;
export default Myzone;
