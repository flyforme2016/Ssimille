/* eslint-disable prettier/prettier */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../screens/Home';
import Community from '../screens/Comunity';
import Userlist from '../screens/Userlist';
import Chatroom from '../screens/Chatroom';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();



const TabBar = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        headerShown: false,

            

        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          borderRadius: 10,
          backgroundColor: '#ffffff',
          height: 65,

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
            iconName = focused ? 'home' : 'home-outline' ;
          } else if (rn === 'Community') {
            iconName = focused ? 'ios-list' : 'ios-list';
          } else if (rn === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (rn === 'Userlist') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (rn === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={35} color={color} />;
        },
      })}
      tabBarOptions={{
        showLabel : false,
        activeTintColor: '#b7b4df',
        inactiveTintColor: '#9b59b6',

        style : { height:50 },
            tabStyle: { paddingVertical: 5, },
       
       
      }}>
      <Tab.Screen name="Community" component={Community}  />
      <Tab.Screen name="Chat" component={Chatroom} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Userlist" component={Userlist} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default TabBar;