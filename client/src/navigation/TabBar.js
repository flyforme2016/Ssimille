import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../screens/Home/Home';
import Community from '../screens/Community/Comunity';
import FriendList from '../screens/FriendList/FriendList';
import ChatingList from '../screens/ChatScreen/ChatingList';
import MyProfile from '../screens/Profile/MyProfile';

const Tab = createBottomTabNavigator();

const TabBar = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        headerShown: false,

        tabBarStyle: {
          borderRadius: 10,
          backgroundColor: 'white',
        },

        tabBarActiveTintColor: '#b7b4df',
        tabBarInactiveTintColor: '#9b59b6',

        tabBarItemStyle: {
          bottom: 25,
          height: 100,
          padding: 15,
        },

        tabBarIcon: ({focused, color}) => {
          let iconName;
          let rn = route.name;

          if (rn === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (rn === 'Community') {
            iconName = focused ? 'ios-list' : 'ios-list';
          } else if (rn === 'ChatingList') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (rn === 'FriendList') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (rn === 'MyProfile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={35} color={color} />;
        },
      })}>
      <Tab.Screen name="Community" component={Community} />
      <Tab.Screen name="ChatingList" component={ChatingList} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="FriendList" component={FriendList} />
      <Tab.Screen
        name="MyProfile"
        component={MyProfile}
        options={{
          unmountOnBlur: true,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabBar;
