import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import OtherFollower from './OtherFollower';
import OtherFollowing from './OtherFollowing';
import styled from 'styled-components/native';

const OtherTabBar = ({route}) => {
  const Tab = createMaterialTopTabNavigator();
  const OtherUid = route.params.userId;
  console.log('route : ', OtherUid, typeof OtherUid);

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
      <Tab.Screen
        name="팔로잉"
        children={() => <OtherFollowing OtherUid={OtherUid} />}
      />
      <Tab.Screen
        name="팔로워"
        children={() => <OtherFollower OtherUid={OtherUid} />}
      />
    </Tab.Navigator>
  );
};

const NavText = styled.Text`
  color: #9b59b6;
  font-size: 24;
  padding: 5px;
`;
export default OtherTabBar;
