/* eslint-disable prettier/prettier */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Notice from '../screens/Notice';
import Myzone from '../screens/Myzone';
import ProfileEdit from '../screens/Profile/ProfileEdit';
import CommunityUpload from '../screens/Community/CommunityUpload';

const NativeStack = createNativeStackNavigator();

const Stack = () => {
  return (
    <NativeStack.Navigator>
      <NativeStack.Screen name="Notice" component={Notice} />
      <NativeStack.Screen name="Myzone" component={Myzone} />
      <NativeStack.Screen name="ProfileEdit" component={ProfileEdit} />
      <NativeStack.Screen name="CommunityUpload" component={CommunityUpload} />
    </NativeStack.Navigator>
  );
};

export default Stack;
