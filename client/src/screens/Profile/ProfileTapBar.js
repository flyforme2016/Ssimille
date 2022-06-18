import React from 'react';
import styled from 'styled-components/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PostList from './PostList';

const LIKE = {
  uri: 'https://cdn1.iconfinder.com/data/icons/basic-ui-element-2-2-line/512/Basic_UI_Elements_-_2.1_-_line-22-128.png',
  width: 20,
  height: 20,
};
const COMMENTS = {
  uri: 'https://cdn4.iconfinder.com/data/icons/network-and-communication-2-10/48/78-128.png',
  width: 20,
  height: 20,
};

const ProfileTabBar = () => {
  const Tab = createMaterialTopTabNavigator();

  const Posts = () => {
    return (
      <View>
        <Container>
          <Card>
            <Image source={LIKE} />
            <Image source={COMMENTS} />
          </Card>
          <Card>
            <Image source={LIKE} />
            <Image source={COMMENTS} />
          </Card>
          <Card>
            <Image source={LIKE} />
            <Image source={COMMENTS} />
          </Card>
        </Container>
      </View>
    );
  };

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
          if (route.name === 'Posts') {
            iconName = focused ? 'ios-apps-sharp' : 'ios-apps-sharp';
            color = focused ? '#b7b4df' : 'gray';
          } else if (route.name === 'PostList') {
            iconName = focused ? 'headset' : 'headset-outline';
            color = focused ? '#b7b4df' : 'gray';
          }

          return <Ionicons name={iconName} color={color} size={22} />;
        },
      })}>
      <Tab.Screen name="PostList" component={PostList} />
      <Tab.Screen name="Posts" component={Posts} />
    </Tab.Navigator>
  );
};

const Image = styled.Image`
  width: 30;
  height: 30;
`;
const View = styled.View`
  background-color: #ffffff;
`;
const Container = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    alignItems: 'center',
  },
}))``;

const Card = styled.View`
  width: 250;
  height: 150;
  margin: 10px;
  padding: 10px;
  background-color: #b7b4df;
  flex-direction: row;
  justify-content: space-between;
`;

export default ProfileTabBar;
