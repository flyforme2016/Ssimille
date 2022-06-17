import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabBar from './TabBar';
import Stack from './Stack';
import KakaoLogin from '../screens/KakaoLogin';

const Nav = createNativeStackNavigator();

const Navigation = () => {
  return (
    <Nav.Navigator
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}>
      <Nav.Screen name="KakaoLogin" component={KakaoLogin} />
      <Nav.Screen name="TabBar" component={TabBar} />
      <Nav.Screen name="Stack" component={Stack} />
    </Nav.Navigator>
  )
};

export default Navigation;
