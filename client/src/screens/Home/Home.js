import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, RefreshControl} from 'react-native';
import styled from 'styled-components/native';
import logo from '../../logo.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SpotifyTab from '../../components/SpotifyTab';
import Swiper from 'react-native-swiper';
const Home = ({navigation: {navigate}}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  //새로고침 하면 데이터 다시 받아오는 함수
  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };
  const getData = async () => {
    try {
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return loading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <>
      <Container
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }>
        <TopBar>
          <Logo source={logo} />
          <Notice onPress={() => navigate('Stack', {screen: 'Notice'})}>
            <Ionicons name="alert-circle-outline" size={30} />
          </Notice>
        </TopBar>
        <MyzoneContainer>
          <Btn onPress={() => navigate('Stack', {screen: 'Myzone'})}>
            <Text>MY ZONE</Text>
          </Btn>
        </MyzoneContainer>
        <Btn
          onPress={async () => {
            console.log(await AsyncStorage.getItem('userNumber'));
          }}>
          <Text>usertoken</Text>
        </Btn>
        <RecommendText>음악 추천</RecommendText>
        <AlbumRecommendContainer>
          <AlbumContainer>
            <AlbumImg source={require('../../assets/sample/5.jpg')} />
            <AlBumInfo>name</AlBumInfo>
            <AlBumInfo>artist</AlBumInfo>
          </AlbumContainer>
        </AlbumRecommendContainer>

        <Swiper height={300} loadMinimal={true} showsButtons={true}>
          <ImageContainer>
            <PostImg source={require('../../assets/sample/2.jpg')} />
          </ImageContainer>

          <AlbumImgBtn
            onPress={() => {
              console.log('swiper clicked');
            }}>
            <SelectedMusic>노래제목- 노래이름</SelectedMusic>
            <PostImg source={require('../../assets/sample/2.jpg')} />
          </AlbumImgBtn>
        </Swiper>
      </Container>
      <SpotifyTab />
    </>
  );
};

const SelectedMusic = styled.Text`
  font-size: 14px;
`;

const ImageContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const PostImg = styled.Image`
  width: 250;
  height: 250;
  margin: 5px;
`;
const AlbumImgBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

///
const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.ScrollView`
  background-color: lightgrey;
`;
const TopBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
const Logo = styled.Image`
  background-color: white;
  width: 100;
  height: 50;
`;
const Notice = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;
const MyzoneContainer = styled.View`
  flex: 1;
`;
const Btn = styled.TouchableOpacity`
  background-color: white;
  align-items: center;
  justify-content: center;
  border: 2px solid grey;
`;
const Text = styled.Text`
  font-size: 18;
`;

// 여기까지 기능 테스트용 코드
const RecommendText = styled.Text`
  margin: 5px;
  font-size: 16px;
`;
const AlbumRecommendContainer = styled.View`
  margin: 12px;
  padding: 8px;
  flex-direction: row;
`;
const AlbumContainer = styled.View`
  padding: 12px;
  border: 2px gray;
`;
const AlbumImg = styled.Image`
  width: 100;
  height: 100;
`;
const AlBumInfo = styled.Text`
  padding-top: 3px;
  font-size: 12px;
`;

export default Home;
