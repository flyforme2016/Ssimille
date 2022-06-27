import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GridPosts from './GridPosts';

const ProfileTabBar = ({userId}) => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarIndicatorStyle: {
          backgroundColor: '#b7b4df',
        },
        tabBarStyle: {
          backgroundColor: '#f9fbfc',
        },
        tabBarIcon: ({focused, color}) => {
          let iconName;
          if (route.name === 'GridPosts') {
            iconName = focused ? 'ios-apps-sharp' : 'ios-apps-sharp';
            color = focused ? '#b7b4df' : 'gray';
          }
          return <Ionicons name={iconName} color={color} size={20} />;
        },
      })}>
      <Tab.Screen
        name="GridPosts"
        children={() => <GridPosts userId={userId} />}
      />
    </Tab.Navigator>
  );
};

export default ProfileTabBar;
