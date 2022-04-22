/* eslint-disable prettier/prettier */

import React, {useState} from 'react';
import KakaoSDK from '@actbase/react-kakaosdk';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../screens/Home';
import Community from '../screens/Comunity';
import Userlist from '../screens/Userlist';
import Chatroom from '../screens/Chatroom';
import Profile from '../screens/Profile';
import CustomButton from '../components/CustomButtons';

const Tab = createBottomTabNavigator();

const Routes = () => {
  const [accessToken, setAccessToken] = useState(true);
  const kakaoLogin = async () => {
    try {
      await KakaoSDK.init('71a2f9a5ab9311f766693e041769838a');
      const tokens = await KakaoSDK.login();
      console.log(tokens);
      setAccessToken(tokens.access_token);
    } catch (e) {
      console.log(e);
    }
  };

  return accessToken ? (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        headerShown: false,

        tabBarStyle: {
          position: 'absolute',
          bottom: 10,
          borderRadius: 30,
          backgroundColor: '#ffffff',
        },

        tabBarItemStyle: {
          bottom: 25,
          height: 100,
          padding: 15,
        },
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let rn = route.name;

          if (rn === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (rn === 'Community') {
            iconName = focused ? 'ios-list' : 'ios-list';
          } else if (rn === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (rn === 'Userlist') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (rn === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#b7b4df',
        inactiveTintColor: '#9b59b6',
        showLabel: true,
      }}>
      <Tab.Screen name="Community" component={Community} />
      <Tab.Screen name="Chat" component={Chatroom} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Userlist" component={Userlist} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  ) : (
    <CustomButton
      text="카카오 로그인하기"
      onPress={kakaoLogin}
      bgColor="#FAE078"
      fgColor="#FF9100"
    />
  );
};

export default Routes;
