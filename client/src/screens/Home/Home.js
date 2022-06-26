import React from 'react';
import {ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import logo from '../../logo.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SpotifyTab from '../../components/SpotifyTab';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import actions from '../../actions/index';
import Config from 'react-native-config';
import {useQuery} from 'react-query';

const Home = ({navigation: {navigate, push}}) => {
  const BASE_URL = Config.BASE_URL;
  const dispatch = useDispatch();
  const {kakaoUid} = useSelector(state => state.kakaoUid);
  const {locationName} = useSelector(state => state.locationName);

  //내 프로필 가져오기
  const {isLoading} = useQuery(
    'getMyProfile',
    async () => {
      const {data} = await axios.get(`${BASE_URL}/profile/getUserProfile`, {
        params: {
          key: kakaoUid,
        },
      });
      return data;
    },
    {
      onSuccess: res => {
        dispatch(actions.saveUserProfileAction(res));
      },
    },
  );
  return isLoading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <>
      <Container>
        <TopBar>
          <Logo source={logo} />
          <Notice onPress={() => navigate('Stack', {screen: 'Notice'})}>
            <Ionicons name="alert-circle-outline" size={30} />
          </Notice>
        </TopBar>
        <MyzoneContainer>
          <Btn onPress={() => push('Stack', {screen: 'Myzone'})}>
            <Text>MY ZONE </Text>
            <Text> {locationName ? locationName.address_name : null}</Text>
          </Btn>
        </MyzoneContainer>
        <MyzoneContainer>
          <Btn onPress={() => push('TabBar', {screen: 'MyProfile'})}>
            <Text>MY Profile</Text>
          </Btn>
        </MyzoneContainer>
        <MyzoneContainer>
          <Btn onPress={() => push('TabBar', {screen: 'Community'})}>
            <Text>Community</Text>
          </Btn>
        </MyzoneContainer>
        <MyzoneContainer>
          <Btn onPress={() => push('TabBar', {screen: 'ChatingList'})}>
            <Text>ChatList</Text>
          </Btn>
        </MyzoneContainer>

        <RecommendText>음악 추천</RecommendText>
        <AlbumRecommendContainer>
          <AlbumContainer>
            <AlbumImg source={require('../../assets/sample/background.jpg')} />
            <AlBumInfo>name</AlBumInfo>
            <AlBumInfo>artist</AlBumInfo>
          </AlbumContainer>
        </AlbumRecommendContainer>
      </Container>
      <SpotifyTab />
    </>
  );
};

///
const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.ScrollView`
  background-color: white;
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
const MyzoneContainer = styled.View``;
const Btn = styled.TouchableOpacity`
  padding: 10px;
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
