import React, {useEffect, useLayoutEffect, useState} from 'react';
import Styled from 'styled-components/native';
import MapView, {Circle, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {Alert, PermissionsAndroid} from 'react-native';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../actions/index';
import Config from 'react-native-config';

const KAKAOMAP_API_KEY = '1c1252b4d425329642c458690fe99854';

const Myzone = ({navigation}) => {
  const BASE_URL = Config.BASE_URL;
  const [location, setLocation] = useState();
  const [locationName, setLocationName] = useState();
  const {kakaoUid} = useSelector(state => state.kakaoUid);
  const dispatch = useDispatch();

  const postLocation = async () => {
    console.log('지도에서 마커 눌림');
    try {
      await axios
        .post(`${BASE_URL}/profile/updateUserRegion`, {
          key: kakaoUid,
          regionCode: locationName.code / 1,
        })
        .then(
          Alert.alert('My Zone 설정', '현재 위치로 MYZONE이 설정되었습니다', [
            {
              text: 'OK',
              onPress: () => {
                console.log('OK Pressed');
                navigation.navigate('TabBar', {screen: 'Home'});
              },
            },
          ]),
        );
    } catch (error) {
      console.log('error: ', error);
    }
  };

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
          setLocation([longitude, latitude]);
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
      console.log('위치 정보 가져오기 시작');
      const res = await axios({
        method: 'GET',
        url: `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${location[0]}&y=${location[1]}`,
        headers: {
          Host: 'dapi.kakao.com',
          Authorization: `KakaoAK ${KAKAOMAP_API_KEY}`,
          'Content-Type': 'application/json;',
        },
      });
      const currentInfo = res.data.documents[0];
      console.log('currentInfo: ', currentInfo)
      dispatch(actions.saveUserLocation(currentInfo));
      setLocationName(currentInfo);
    } catch (error) {
      console.log('error: ', error)
      return error;
    }
  };
  useLayoutEffect(() => {
    console.log('위도경도 가져오기');
    getCurrentLocation();
  }, []);

  useEffect(() => {
    console.log('행정동 이름 가져오기');
    if (location) getLocationName();
  }, [location]);

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
            onPress={postLocation}>
            <MarkerView>
              {locationName ? (
                <LocationText>{locationName.address_name}</LocationText>
              ) : (
                <LocationText>현재위치 확인중</LocationText>
              )}
            </MarkerView>
          </Marker>
          {/* <Circle
            center={{latitude: location[1], longitude: location[0]}}
            radius={3}
          /> */}
        </MapView>
      )}
    </Container>
  );
};

const Container = Styled.View`
  flex: 1;
`;
const MarkerView = Styled.View`
  padding: 12px;
  border: 2px solid #dddddd;
  border-radius: 10px;
  background-color: white;
`;
const LocationText = Styled.Text`
  font-size: 14px;
`;

export default Myzone;