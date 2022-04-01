/* eslint-disable prettier/prettier */
import * as React from 'react';
import {SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import Userlist from './components/pages/Userlist';
import Chatroom from './components/pages/Chatroom';
import Community from './components/pages/Comunity';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <SafeAreaView>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Community" component={Community} />
          <Tab.Screen name="Userlist" component={Userlist} />
          <Tab.Screen
            name="Home"
            component={Home}
            listeners={({navigation}) => ({
              tabPress: e => {
                e.preventDefault();
                navigation.navigate('Home');
              },
            })}
          />
          <Tab.Screen name="Chatroom" component={Chatroom} />
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
