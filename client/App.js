/* eslint-disable prettier/prettier */
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from './pages/Home';
import Profile from './pages/Profile';
import Userlist from './pages/Userlist';
import Chatroom from './pages/Chatroom';
import Community from './pages/Comunity';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="SSIMILLE"
          component={Home}
          listeners={({navigation}) => ({
            tabPress: e => {
              e.preventDefault();
              navigation.navigate('Home');
            },
          })}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          listeners={({navigation}) => ({
            tabPress: e => {
              e.preventDefault();
              navigation.navigate('Profile');
            },
          })}
        />
        <Tab.Screen
          name="Userlist"
          component={Userlist}
          listeners={({navigation}) => ({
            tabPress: e => {
              e.preventDefault();
              navigation.navigate('Userlist');
            },
          })}
        />
        <Tab.Screen
          name="Chatroom"
          component={Chatroom}
          listeners={({navigation}) => ({
            tabPress: e => {
              e.preventDefault();
              navigation.navigate('Chatroom');
            },
          })}
        />
        <Tab.Screen
          name="Community"
          component={Community}
          listeners={({navigation}) => ({
            tabPress: e => {
              e.preventDefault();
              navigation.navigate('Community');
            },
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
