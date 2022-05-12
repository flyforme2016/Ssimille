import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FriendRequestList from './FriendRequestList';
import CurrentFriendList from './CurrentFriendList';

const FriendListTabBar = () => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarIndicatorStyle: {
          backgroundColor: 'black',
          height: 1.5,
        },
        tabBarStyle: {
          backgroundColor: '#f9fbfc',
        },
        tabBarIcon: ({focused, color}) => {
          let iconName;
          if (route.name === 'CurrentFriendList') {
            iconName = focused ? 'reorder-four' : 'reorder-four-outline';
            color = focused ? '#b7b4df' : 'gray';
          } else if (route.name === 'FriendRequestList') {
            iconName = focused ? 'person-add' : 'person-add-outline';
            color = focused ? '#b7b4df' : 'gray';
          }

          return <Ionicons name={iconName} color={color} size={22} />;
        },
      })}>
      <Tab.Screen name="CurrentFriendList" component={CurrentFriendList} />
      <Tab.Screen name="FriendRequestList" component={FriendRequestList} />
    </Tab.Navigator>
  );
};

export default FriendListTabBar;
