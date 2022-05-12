import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Notice from '../screens/Notice';
import Myzone from '../screens/Myzone';
import CommunityUpload from '../screens/Community/CommunityUpload';
import ChatScreen from '../screens/ChatScreen/ChatScreen';
import ProfileEdit from '../screens/Profile/ProfileEdit';

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
      {/* <NativeStack.Screen nema="ChatScreen" component={ChatScreen} />*/}
      <NativeStack.Screen name="ProfileEdit" component={ProfileEdit} />
      <NativeStack.Screen name="CommunityUpload" component={CommunityUpload} />
    </NativeStack.Navigator>
  );
};

export default Stack;
