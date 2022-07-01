import React, { useLayoutEffect, useState } from 'react';
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
import getRef from '../../functions/getRef'
import {onSnapshot} from 'firebase/firestore';
import TopNavBar from '../../components/TopNavBar';

const Home = ({navigation: {navigate, push}}) => {
  const BASE_URL = Config.BASE_URL;
  const dispatch = useDispatch();
  const {kakaoUid} = useSelector(state => state.kakaoUid);
  const {locationName} = useSelector(state => state.locationName);
  const [alarmStack, setAlarmStack] = useState(0)

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

  useLayoutEffect(() => {
    getAlarmStack()
  }, [])
  const getAlarmStack = async () => {
    const stackAlarmDocRef = getRef.alarmStackDocRef(kakaoUid)
    onSnapshot(stackAlarmDocRef, doc=>{
      if(doc.exists()){
        setAlarmStack(doc.data().stack)
      }
    })
  }

  return isLoading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <>
      <Container>
        <TopBar>
          <Logo source={logo} />
          <AlarmWrapper>
            <AlarmButton onPress={() => navigate('Stack', {screen: 'Notice'})}>
              <Ionicons name="notifications-outline" size={30} color="#b7b4df" />
            </AlarmButton>
            {alarmStack !== 0 ? (
              <AlarmStackWrapper>
                <AlarmStack>{alarmStack ? alarmStack : null}</AlarmStack>
              </AlarmStackWrapper>
            ) : null}
          </AlarmWrapper>
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

const AlarmWrapper = styled.View`
  align-items: center;
  justify-content: center;
`

const AlarmButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  margin-right: 5px;
`;

const AlarmStackWrapper = styled.View`
  position:absolute;
  right:8px;
  top:5px;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  background-color: #b7b4df;
  border-radius: 7.5;
`

const AlarmStack = styled.Text`
  font-size: 8px;
  color: white;
  font-family: 'Lato-Regular';
  text-align: center;
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
