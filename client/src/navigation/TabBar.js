import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../screens/Home/Home';
import Community from '../screens/Community/Comunity';
import FriendList from '../screens/FriendList/FriendList';
import MessagesScreen from '../screens/ChatScreen/MessagesScreen';
import Profile from '../screens/Profile/Profile';

const Tab = createBottomTabNavigator();

const TabBar = () => {
  // const loginResult = () => {
  //   AsyncStorage.getItem('userNumber', result => {
  //     setLoginState(result);
  //   });
  // };
  // useEffect(() => {
  //   loginResult();
  // }, []);
  return (
    <Tab.Navigator
      initialRouteName="Community"
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
          } else if (rn === 'MessagesScreen') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (rn === 'FriendList') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (rn === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={35} color={color} />;
        },
      })}>
      <Tab.Screen name="Community" component={Community} />
      <Tab.Screen name="MessagesScreen" component={MessagesScreen} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="FriendList" component={FriendList} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default TabBar;
