import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TotalCommunity from './TotalCommunity';
import RegionCommunity from './RegionCommunity';

const CommunityTabBar = () => {
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
          if (route.name === 'TotalCommunity') {
            iconName = focused ? 'ios-apps-sharp' : 'ios-apps-sharp';
            color = focused ? '#b7b4df' : 'gray';
          } else if (route.name === 'RegionCommunity') {
            iconName = focused ? 'headset' : 'headset-outline';
            color = focused ? '#b7b4df' : 'gray';
          }

          return <Ionicons name={iconName} color={color} size={22} />;
        },
      })}>
      <Tab.Screen name="TotalCommunity" component={TotalCommunity} />
      <Tab.Screen name="RegionCommunity" component={RegionCommunity} />
    </Tab.Navigator>
  );
};

export default CommunityTabBar;
