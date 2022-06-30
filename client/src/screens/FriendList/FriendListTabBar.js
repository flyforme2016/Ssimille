import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MyFollower from './MyFollower';
import MyFollwing from './MyFollowing';

const FriendListTabBar = () => {
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
          backgroundColor: '#ffffff',
        },
      })}>
      <Tab.Screen name="팔로잉" component={MyFollwing} />
      <Tab.Screen name="팔로워" component={MyFollower} />
    </Tab.Navigator>
  );
};

export default FriendListTabBar;
