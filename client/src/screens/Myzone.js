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

  //내 프로필 가져오기
  const {isLoading: profile} = useQuery('getMyProfile', async () => {
    const {data} = await axios.get(`${BASE_URL}/users/profile`, {
      params: {
        key: kakaoUid,
      },
    });
    dispatch(actions.saveUserProfileAction(data));
    return data;
  });
  // 친구추천용 장르 데이터 가져오기
  const {isLoading: genre} = useQuery('getMyGenres', async () => {
    const {data} = await axios.get(`${BASE_URL}/users/genre-matrix`, {
      params: {
        key: kakaoUid,
      },
    });
    dispatch(actions.saveMyGenres(data));
    return data;
  });
  // 위도 경도 법정동 이름으로 변환
  const {isLoading: location, data: locationData} = useQuery(
    'locationData',
    async () => {
      const {data} = await axios.get(
        `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${userLocation.longitude}&y=${userLocation.latitude}`,
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
      onSuccess: res => console.log(res),
      onError: err => console.log(err),
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
          Alert.alert(
            'My Zone 설정 안함',
            '위치를 설정하지 않을 경우 일부 기능에 제한이 있습니다. 정말로 취소하시겠습니까?',
            [
              {
                text: 'Cancel',
                onPress: () => {
                  console.log('cancel');
                },
              },

              {
                text: 'OK',
                onPress: async () => {
                  navigation.replace('TabBar', {screen: 'Home'});
                },
              },
            ],
          );
        },
      },

      {
        text: 'OK',
        onPress: async () => {
          console.log('OK Pressed');
          await axios.put(`${BASE_URL}/users/region`, {
            key: kakaoUid,
            regionCode: locationData.documents[0].code / 1,
          });
          dispatch(actions.saveUserLocationName(locationData.documents[0]));
          navigation.replace('TabBar', {screen: 'Home'});
        },
      },
    ]);
  };

  return (
    <Container>
      {!location && (
        <MapView
          style={{flex: 1}}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
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
