import React from 'react';
import Styled from 'styled-components/native';
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
  const {kakaoUid} = useSelector(state => state.kakaoUid);
  const {userLocation} = useSelector(state => state.userLocation);
  const dispatch = useDispatch();

  const {isLoading, data: locationData} = useQuery(
    'locationName',
    () =>
      fetch(
        `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${userLocation['longitude']}&y=${userLocation['latitude']}`,
        {
          headers: {
            Host: 'dapi.kakao.com',
            Authorization: `KakaoAK ${KAKAOMAP_API_KEY}`,
          },
        },
      ).then(res => res.json()),
    {
      onError: e => {
        // 401, 404 같은 error가 아니라 정말 api 호출이 실패한 경우만 호출
        console.log(e.message);
      },
    },
  );

  const postLocation = async () => {
    console.log('지도에서 마커 눌림');
    try {
      await axios
        .post(`${BASE_URL}/profile/updateUserRegion`, {
          key: kakaoUid,
          regionCode: locationData.documents[0].code / 1,
        })
        .then(
          Alert.alert('My Zone 설정', '현재 위치로 MYZONE이 설정되었습니다', [
            {text: 'Cancel'},

            {
              text: 'OK',
              onPress: () => {
                console.log('OK Pressed');
                dispatch(
                  actions.saveUserLocationName(locationData.documents[0]),
                );
                navigation.navigate('TabBar', {screen: 'Home'});
              },
            },
          ]),
        );
    } catch (error) {
      console.log('error: ', error);
    }
  };

  return (
    <Container>
      {!isLoading && (
        <MapView
          style={{flex: 1}}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: userLocation['latitude'],
            longitude: userLocation['longitude'],
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{
              latitude: userLocation['latitude'],
              longitude: userLocation['longitude'],
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
