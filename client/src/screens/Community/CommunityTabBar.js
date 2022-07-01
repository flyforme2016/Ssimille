import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import TotalCommunity from './TotalCommunity';
import RegionCommunity from './RegionCommunity';

const CommunityTabBar = () => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarShowLabel: true,
        tabBarIndicatorStyle: {
          backgroundColor: 'black',
          height: 1.5,
        },
        tabBarStyle: {
          backgroundColor: '#f9fbfc',
        },
      })}>
      <Tab.Screen name="전체 게시글" component={TotalCommunity} />
      <Tab.Screen name="지역 게시글" component={RegionCommunity} />
    </Tab.Navigator>
  );
};

export default CommunityTabBar;
