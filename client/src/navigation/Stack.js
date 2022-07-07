import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Notice from '../screens/Notice';
import Myzone from '../screens/Myzone';
import CommunityUpload from '../screens/Community/CommunityUpload';
import OneByOneChating from '../screens/ChatScreen/OneByOneChating';
import ProfileEdit from '../screens/Profile/ProfileEdit';
import KakaoLogin from '../screens/KakaoLogin';
import SearchMusic from '../components/SearchMusic';
import CommunityPost from '../components/CommunityPost';
import OtherUserProfile from '../screens/Profile/OtherUserProfile';
import Onboarding from '../screens/Start/Start';
import FavoriteSongs from '../components/FavoriteSongs';
import SpotifyAuthentication from '../functions/SpotifyAuthentication';
import PostComments from '../components/PostComments';
import EditFavoriteSongs from '../screens/Profile/EditFavoriteSongs';
const NativeStack = createNativeStackNavigator();
import OtherTabBar from '../screens/FriendList/OtherTabBar';
import BigPicture from '../screens/Profile/BigPicture';
const Stack = () => {
  return (
    <NativeStack.Navigator
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
      }}>
      <NativeStack.Screen name="Myzone" component={Myzone} />
      <NativeStack.Screen name="Notice" component={Notice} />
      <NativeStack.Screen name="OneByOneChating" component={OneByOneChating} />
      <NativeStack.Screen name="ProfileEdit" component={ProfileEdit} />
      <NativeStack.Screen name="SearchMusic" component={SearchMusic} />
      <NativeStack.Screen name="CommunityUpload" component={CommunityUpload} />
      <NativeStack.Screen name="CommunityPost" component={CommunityPost} />
      <NativeStack.Screen name="PostComments" component={PostComments} />
      <NativeStack.Screen name="OtherTabBar" component={OtherTabBar} />
      <NativeStack.Screen name="BigPicture" component={BigPicture} />
      <NativeStack.Screen name="KakaoLogin" component={KakaoLogin} />
      <NativeStack.Screen
        name="SpotifyAuthentication"
        component={SpotifyAuthentication}
      />
      <NativeStack.Screen
        name="OtherUserProfile"
        component={OtherUserProfile}
      />
      <NativeStack.Screen name="Onboarding" component={Onboarding} />
      <NativeStack.Screen name="FavoriteSongs" component={FavoriteSongs} />
      <NativeStack.Screen
        name="EditFavoriteSongs"
        component={EditFavoriteSongs}
      />
    </NativeStack.Navigator>
  );
};

export default Stack;
