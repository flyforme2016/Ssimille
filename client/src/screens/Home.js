/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Dimensions, RefreshControl} from 'react-native';
import Swiper from 'react-native-web-swiper';
import styled from 'styled-components/native';
import logo from '../logo.png';

const Home = ({navigation: {navigate}}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getData();
  }, []);

  //새로고침 하면 데이터 다시 받아오는 함수
  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };
  const getData = () => {
    //spotify api 연결해서 데이터 받아오기
    setLoading(false);
  };
  return loading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <Container
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
      }>
      <TopBar>
        <Logo source={logo} />
        <Notice onPress={() => navigate('Stack', {screen: 'Notice'})}>
          <Text>Notice</Text>
        </Notice>
      </TopBar>
      <Myzone>
        <Btn onPress={() => navigate('Stack', {screen: 'Myzone'})}>
          <Text>MY ZONE</Text>
        </Btn>
      </Myzone>

      <Text>친구들의 추천</Text>
      <Swiper loop containerStyle={{width: '100%', height: SCREEN_HEIGHT / 3}}>
        <Playlist />
        <Playlist style={{backgroundColor: 'white'}} />
        <Playlist />
        <Playlist style={{backgroundColor: 'white'}} />
      </Swiper>

      <Text>오늘의 친구 추천</Text>
      <Swiper
        loop
        timeout={2}
        containerStyle={{width: '100%', height: SCREEN_HEIGHT / 3}}>
        <Friendlist />
        <Friendlist style={{backgroundColor: 'white'}} />
        <Friendlist />
        <Friendlist style={{backgroundColor: 'white'}} />
        <Friendlist />
      </Swiper>

      <Swiper loop containerStyle={{width: '100%', height: SCREEN_HEIGHT / 3}}>
        <Playlist />
        <Playlist style={{backgroundColor: 'white'}} />
        <Playlist />
        <Playlist style={{backgroundColor: 'white'}} />
      </Swiper>

      <Swiper loop containerStyle={{width: '100%', height: SCREEN_HEIGHT / 3}}>
        <Playlist />
        <Playlist style={{backgroundColor: 'white'}} />
        <Playlist />
        <Playlist style={{backgroundColor: 'white'}} />
      </Swiper>
    </Container>
  );
};

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.ScrollView`
  flex: 1;
  background-color: lightgrey;
`;
const TopBar = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;
const Logo = styled.Image`
  background-color: white;
  width: 150;
  height: 70;
`;
const Notice = styled.TouchableOpacity`
  width: 100;
  background-color: white;
  align-items: center;
  justify-content: center;
  border: 2px solid grey;
`;
const Myzone = styled.View`
  flex: 1;
`;
const Btn = styled.TouchableOpacity`
  background-color: white;
  align-items: center;
  justify-content: center;
  border: 2px solid grey;
`;
const Playlist = styled.View`
  flex: 1;
  background-color: skyblue;
`;
const Friendlist = styled.View`
  flex: 1;
  background-color: tomato;
`;
const Text = styled.Text`
  font-size: 18;
`;

export default Home;
