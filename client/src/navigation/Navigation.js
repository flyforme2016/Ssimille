import React, {useLayoutEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabBar from './TabBar';
import Stack from './Stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from '../screens/Start/Start';
import SpotifyAuthentication from '../components/SpotifyAuthentication';
import {useDispatch} from 'react-redux';
import actions from '../actions/index';

const Nav = createNativeStackNavigator();

const Navigation = () => {
  const [token, setToken] = useState();
  const dispatch = useDispatch();
  useLayoutEffect(()=> {
    async function dispatchKakaoUid() {
      const userId = await AsyncStorage.getItem('userNumber');
      if(userId){
        dispatch(actions.saveKakaoUidAction(userId))
        setToken(userId);
      }
    }
    dispatchKakaoUid()
  }, [])

<<<<<<< HEAD
  const loginState = async () => {
    setToken(await AsyncStorage.getItem('userNumber'));
    console.log('로그인확인', await token);
  };
  useLayoutEffect(() => {
    loginState();
  }, []);
  return token == null || undefined ? (
=======
  // const [loginState, setLoginState] = useState(false);
  // const dispatch = useDispatch();
  // const authControl = async () => {
  //   const userId = await AsyncStorage.getItem('userNumber');
  //   console.log('userId: ', userId)
  //   if(userId){
  //     console.log('Enter')
  //     dispatch(actions.saveKakaoUidAction(userId))
  //   }
  //   setLoginState(userId);
  // };
  // useEffect(() => {
  //   authControl();
  // });
  return typeof token !== null ? (
>>>>>>> origin/gijeong_spotifyTab
    <Nav.Navigator
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}>
<<<<<<< HEAD
      <Nav.Screen name="Start" component={Onboarding} />
=======
      <Nav.Screen name="SpotifyAuthentication" component={SpotifyAuthentication} />
>>>>>>> origin/gijeong_spotifyTab
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
