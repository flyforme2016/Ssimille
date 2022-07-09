import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabBar from './TabBar';
import Stack from './Stack';
import Start from '../screens/Start/Start';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQuery} from 'react-query';
import KakaoLogin from '../screens/Start/KakaoLogin';

const Nav = createNativeStackNavigator();

const Navigation = () => {
  const {isLoading, data: checkUid} = useQuery('checkUid', async () => {
    const myUid = await AsyncStorage.getItem('userNumber');
    return myUid;
  });

  return (
    !isLoading &&
    (checkUid ? (
      <Nav.Navigator
        screenOptions={{
          presentation: 'modal',
          headerShown: false,
        }}>
        <Nav.Screen name="KakaoLogin" component={KakaoLogin} />
        <Nav.Screen name="TabBar" component={TabBar} />
        <Nav.Screen name="Stack" component={Stack} />
      </Nav.Navigator>
    ) : (
      <Nav.Navigator
        screenOptions={{
          presentation: 'modal',
          headerShown: false,
        }}>
        <Nav.Screen name="Login" component={Start} />
        <Nav.Screen name="KakaoLogin" component={KakaoLogin} />
        <Nav.Screen name="TabBar" component={TabBar} />
        <Nav.Screen name="Stack" component={Stack} />
      </Nav.Navigator>
    ))
  );
};

export default Navigation;
