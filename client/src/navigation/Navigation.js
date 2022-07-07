import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabBar from './TabBar';
import Stack from './Stack';
import KakaoLogin from '../screens/KakaoLogin';
import Login from '../screens/Start/Login';

const Nav = createNativeStackNavigator();

const Navigation = () => {
  const [token, setToken] = useState();
  const loginState = async () => {
    setToken(await AsyncStorage.getItem('userNumber'));
    console.log('로그인확인', token);
  };
  loginState();
  return typeof token === null ? (
    <Nav.Navigator
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}>
      <Nav.Screen name="Login" component={Login} />
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
      <Nav.Screen name="KakaoLogin" component={KakaoLogin} />
      <Nav.Screen name="TabBar" component={TabBar} />
      <Nav.Screen name="Stack" component={Stack} />
    </Nav.Navigator>
  );
};

export default Navigation;
