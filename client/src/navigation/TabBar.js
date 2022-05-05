/* eslint-disable prettier/prettier */

import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../screens/Home';
import Community from '../screens/Comunity';
import Userlist from '../screens/Userlist';
import MessagesScreen from '../screens/MessagesScreen';
import Profile from '../screens/Profile';
import KakaoLogin from '../screens/KakaoLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const TabBar = () => {
  const [loginState, setLoginState] = useState(true);

  // const loginResult = () => {
  //   AsyncStorage.getItem('userNumber', result => {
  //     setLoginState(result);
  //   });
  // };
  // useEffect(() => {
  //   loginResult();
  // }, []);

  return loginState ? (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        headerShown: false,

        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          borderRadius: 10,
          backgroundColor: 'white',
          height: 65,
        },

        tabBarActiveTintColor: '#b7b4df',
        tabBarInactiveTintColor: '#9b59b6',

        tabBarItemStyle: {
          bottom: 25,
          height: 100,
          padding: 15,
        },

        tabBarIcon: ({focused, color}) => {
          let iconName;
          let rn = route.name;

          if (rn === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (rn === 'Community') {
            iconName = focused ? 'ios-list' : 'ios-list';
          } else if (rn === 'MessagesScreen') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (rn === 'Userlist') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (rn === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={35} color={color} />;
        },
      })}>
      <Tab.Screen name="Community" component={Community} />
      <Tab.Screen name="MessagesScreen" component={MessagesScreen} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Userlist" component={Userlist} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="KakaoLogin" component={KakaoLogin} />
    </Tab.Navigator>
  ) : (
    <KakaoLogin />
  );
};

export default TabBar;
