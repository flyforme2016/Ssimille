/* eslint-disable prettier/prettier */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from '../screens/Home';
import Community from '../screens/Comunity';
import Userlist from '../screens/Userlist';
import Chatroom from '../screens/Chatroom';
import Profile from '../screens/Profile';

const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="CommunityScreen" component={Community} />
      <Stack.Screen name="UserListScreen" component={Userlist} />
      <Stack.Screen name="ChatRoomScreen" component={Chatroom} />
      <Stack.Screen name="ProfileScreen" component={Profile} />
    </Stack.Navigator>
  );
};

export default Routes;
