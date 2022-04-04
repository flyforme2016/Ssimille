/* eslint-disable prettier/prettier */
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import Userlist from './components/pages/Userlist';
import Chatroom from './components/pages/Chatroom';
import Community from './components/pages/Comunity';

const Stack = createNativeStackNavigator();

const HomeScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={Home} />
    </Stack.Navigator>
  );
};
const CommunityScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CommunityScreen" component={Community} />
    </Stack.Navigator>
  );
};
const UserListScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserListScreen" component={Userlist} />
    </Stack.Navigator>
  );
};
const ChatRoomScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatRoomScreen" component={Chatroom} />
    </Stack.Navigator>
  );
};
const ProfileScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileScreen" component={Profile} />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({route}) => ({
            tabBarIcon: ({color, size}) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = 'ios-home';
              }
              iconName = 'ios-home';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
          })}>
          <Tab.Screen
            name="Community"
            component={CommunityScreen}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Userlist"
            component={UserListScreen}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
            listeners={({navigation}) => ({
              tabPress: e => {
                e.preventDefault();
                navigation.navigate('Home');
              },
            })}
          />
          <Tab.Screen
            name="Chatroom"
            component={ChatRoomScreen}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{headerShown: false}}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
