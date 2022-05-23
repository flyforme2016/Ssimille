import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabBar from './TabBar';
import Stack from './Stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KakaoLogin from '../screens/KakaoLogin';

const Nav = createNativeStackNavigator();

const Navigation = () => {
  const [loginState, setLoginState] = useState(false);
  const authControl = async () => {
    const userId = await AsyncStorage.getItem('userNumber');
    setLoginState(userId);
  };
  useEffect(() => {
    authControl();
  });

  return loginState ? (
    <Nav.Navigator
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}>
      <Nav.Screen name="TabBar" component={TabBar} />
      <Nav.Screen name="Stack" component={Stack} />
    </Nav.Navigator>
  ) : (
    <Nav.Navigator
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}>
      <Nav.Screen name="KakaoLogin" component={KakaoLogin} />
      <Nav.Screen name="TabBar" component={TabBar} />
      <Nav.Screen name="Stack" component={Stack} />
    </Nav.Navigator>
  );
};

export default Navigation;
