import React, {useLayoutEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabBar from './TabBar';
import Stack from './Stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from '../screens/Start/Start';

const Nav = createNativeStackNavigator();

const Navigation = () => {
  const [token, setToken] = useState();

  const loginState = async () => {
    setToken(await AsyncStorage.getItem('userNumber'));
    console.log('로그인확인', await token);
  };
  useLayoutEffect(() => {
    loginState();
  }, []);
  return token == null || undefined ? (
    <Nav.Navigator
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}>
      <Nav.Screen name="Start" component={Onboarding} />
      <Nav.Screen name="TabBar" component={TabBar} />
      <Nav.Screen name="Stack" component={Stack} />
    </Nav.Navigator>
  ) : (
    <Nav.Navigator
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}>
      <Nav.Screen name="TabBar" component={TabBar} />
      <Nav.Screen name="Stack" component={Stack} />
    </Nav.Navigator>
  );
};

export default Navigation;
