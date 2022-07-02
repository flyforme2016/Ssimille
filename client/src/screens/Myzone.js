import React, {useState} from 'react';
import Styled from 'styled-components/native';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {Alert} from 'react-native';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../actions/index';
import Config from 'react-native-config';
import {useQuery} from 'react-query';

const KAKAOMAP_API_KEY = Config.KAKAOMAP_API_KEY;
const BASE_URL = Config.BASE_URL;

const Myzone = ({navigation}) => {
  const [coords, setCoords] = useState({});
  const {kakaoUid} = useSelector(state => state.kakaoUid);
  const dispatch = useDispatch();

  const {isLoading, data: locationData} = useQuery(
    'locationData',
    async () => {
      await Geolocation.getCurrentPosition(
        position => {
          setCoords(position.coords);
        },
        error => {
          console.log(error.message);
        },
        {enableHighAccuracy: true, timeout: 15000},
      );
      console.log('2: 위도 경도 설정완료');

      const {data} = await axios.get(
        `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${coords['longitude']}&y=${coords['latitude']}`,
        {
          headers: {
            Host: 'dapi.kakao.com',
            Authorization: `KakaoAK ${KAKAOMAP_API_KEY}`,
          },
        },
      );
      return data;
    },
    {
      onSuccess: res => {
        console.log('3: 행정동 받기 성공', res.documents[0]);
      },
      onError: e => {
        console.log(e.message);
      },
      refetchInterval: 30000,
      refetchIntervalInBackground: true,
    },
  );

  const postLocation = async () => {
    console.log('지도에서 마커 눌림');

    Alert.alert('My Zone 설정', '현재 위치로 MYZONE이 설정되었습니다', [
      {
        text: 'Cancel',
        onPress: () => {
          console.log('cancel');
        },
      },

      {
        text: 'OK',
        onPress: async () => {
          console.log('OK Pressed');
          await axios.post(`${BASE_URL}/profile/updateUserRegion`, {
            key: kakaoUid,
            regionCode: locationData.documents[0].code / 1,
          });
          dispatch(actions.saveUserLocationName(locationData.documents[0]));
          navigation.navigate('TabBar', {screen: 'Home'});
        },
      },
    ]);
  };

  return (
    <Container>
      {!isLoading && (
        <MapView
          style={{flex: 1}}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: coords['latitude'],
            longitude: coords['longitude'],
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{
              latitude: coords['latitude'],
              longitude: coords['longitude'],
            }}
            onPress={postLocation}>
            <MarkerView>
              {locationData ? (
                <LocationText>
                  {locationData.documents[0].address_name}
                </LocationText>
              ) : (
                <LocationText>현재위치 확인중</LocationText>
              )}
            </MarkerView>
          </Marker>
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
