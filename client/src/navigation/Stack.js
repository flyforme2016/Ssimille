/* eslint-disable prettier/prettier */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Notice from '../screens/Notice';
import Profile from '../screens/Profile';
import Myzone from '../screens/Myzone';
import ProfileEdit from '../screens/ProfileEdit';
import ChatScreen from '../screens/ChatScreen';

const NativeStack = createNativeStackNavigator();

const Stack = () => {
  return (
    <NativeStack.Navigator
    screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}>
      <NativeStack.Screen name="Notice" component={Notice} />
      <NativeStack.Screen name="Myzone" component={Myzone} />
      <NativeStack.Screen name="ProfileEdit" component={ProfileEdit} />
      <NativeStack.Screen name="Profile" component={Profile} />
      <NativeStack.Screen name="ChatScreen" component={ChatScreen} />
    </NativeStack.Navigator>
  );
};

export default Stack;
