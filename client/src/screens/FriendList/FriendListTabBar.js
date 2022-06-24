import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MyFollower from './MyFollower';
import MyFollwing from './MyFollowing';
import styled from 'styled-components/native';

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

const NavText = styled.Text`
  color: #9b59b6;
  font-size: 24;
  padding: 5px;
`;
export default FriendListTabBar;