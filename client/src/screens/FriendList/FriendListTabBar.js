import React from 'react';
import axios from 'axios';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useQuery} from 'react-query';
import Config from 'react-native-config';
import FriendLists from '../../components/FriendLists';

const BASE_URL = Config.BASE_URL;
const Tab = createMaterialTopTabNavigator();

const FriendListTabBar = ({listType, paramsKey}) => {
  const {data: getMyFollwerList} = useQuery('getMyFollwerList', async () => {
    const {data} = await axios(`${BASE_URL}/friend/getMyFollwerList`, {
      params: {
        key: paramsKey,
      },
    });
    return data;
  });

  const {data: getMyFollowingList} = useQuery(
    'getMyFollowingList',
    async () => {
      const {data} = await axios(`${BASE_URL}/friend/getMyFollowingList`, {
        params: {
          key: paramsKey,
        },
      });
      return data;
    },
  );

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
        children={() => (
          <FriendLists
            data={getMyFollwerList}
            listType={listType}
            screenName="following"
          />
        )}
      />

      <Tab.Screen
        name="팔로워"
        children={() => (
          <FriendLists
            data={getMyFollowingList}
            listType={listType}
            screenName="follower"
          />
        )}
      />
    </Tab.Navigator>
  );
};

export default FriendListTabBar;
