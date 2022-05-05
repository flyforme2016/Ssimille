/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import Styled from 'styled-components/native';
import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';

const Notice = () => {
  const [location, setLocation] = useState('');
  const requestPermissions = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('권한 얻기 성공');
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = JSON.stringify(position.coords);
          setLocation({
            latitude,
            longitude,
          });
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } else {
      console.log('권한얻기 실패');
    }
  };
  return (
    <Container>
      <Btn onPress={requestPermissions} />
      {location ? (
        <>
          <Label>Latitude: {location.latitude}</Label>
          <Label>Latitude: {location.longitude}</Label>
        </>
      ) : (
        <Label>Loading...</Label>
      )}
    </Container>
  );
};

const Container = Styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;
const Btn = Styled.TouchableOpacity`
  width: 100;
  height: 100;
  border: 2px solid gray;
`;
const Label = Styled.Text`
    font-size: 24px;
`;

export default Notice;
