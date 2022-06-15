import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Notice from '../screens/Notice';
import Myzone from '../screens/Myzone';
import CommunityUpload from '../screens/Community/CommunityUpload';
import oneByOneChatScreen from '../screens/ChatScreen/OneByOneChating';
import ProfileEdit from '../screens/Profile/ProfileEdit';
import KakaoLogin from '../screens/KakaoLogin';
import SearchMusic from '../screens/SearchMusic';
import SpotifyAuthentication from '../components/SpotifyAuthentication';

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
      <NativeStack.Screen name="OneByOneChatScreen" component={oneByOneChatScreen} />
      <NativeStack.Screen name="ProfileEdit" component={ProfileEdit} />
      <NativeStack.Screen name="SearchMusic" component={SearchMusic} />
      <NativeStack.Screen name="CommunityUpload" component={CommunityUpload} />
      <NativeStack.Screen name="KakaoLogin" component={KakaoLogin} />
      <NativeStack.Screen name="SpotifyAuthentication" component={SpotifyAuthentication} />
    </NativeStack.Navigator>
  );
};

export default Stack;
