/* eslint-disable prettier/prettier */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Notice from '../screens/Notice';
import Profile from '../screens/Profile';
import Myzone from '../screens/Myzone';

const NativeStack = createNativeStackNavigator();

const Stack = () => {
  return (
    <NativeStack.Navigator>
      <NativeStack.Screen name="Notice" component={Notice} />
      <NativeStack.Screen name="Myzone" component={Myzone} />
      <NativeStack.Screen name="Profile" component={Profile} />
    </NativeStack.Navigator>
  );
};

export default Stack;
