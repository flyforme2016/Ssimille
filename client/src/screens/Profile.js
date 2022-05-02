/* eslint-disable prettier/prettier */
import React from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MORE = {
  uri: 'data:image/png;base64,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',
  width: 30,
  height: 30,
};
const AVARTA = {
  uri: 'https://ssimille-bucket.s3.ap-northeast-2.amazonaws.com/defaultProfileImg/defaultProfileImage.jfif',
  width: 70,
  height: 70,
};
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

const Stats = ({count, item}) => {
  return (
    <StatBox>
      <Text>{count}</Text>
      <Text>{item}</Text>
    </StatBox>
  );
};


const Profile = ({navigation: {navigate}}) => {

  const getProfileElment = async() =>{
    try {
      const value = await AsyncStorage.getItem('userNumber');
      if(value !== null){
        const response = await axios.post('http://192.168.0.106:3000/userProfile', {
          params: {
            key: value,
          },
        }).then(res => {
          console.log('res: ', res.body);
        }).catch(err=>{
          console.log('err: ', err);
        })
      }
    } catch (error) {
        console.log('error: ', error);
    }
  };

  getProfileElment();

  return (
    <Container>
      <NavBar>
        <NavText>PROFILE</NavText>
        <Setting onPress={() => navigate('Stack', {screen: 'ProfileEdit'})}>
          <Image source={MORE} />
        </Setting>
      </NavBar>

      <ProfileView>
        <ProfilePic source={AVARTA} />
        <ProfileText>사용자이름</ProfileText>
        <ProfileText>노래이름</ProfileText>
        <ProfileText>한줄소개글</ProfileText>
      </ProfileView>

      <StatsBox>
        <Stats count="게시글" item="2개" />
        <StatDiff />
        <Stats count="친구" item="14명" />
        <StatDiff />
        <Stats count="애청곡" item="24곡" />
      </StatsBox>

      <CardView>
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
        <Card>
          <Image source={LIKE} />
          <Image source={COMMENTS} />
        </Card>
        <Card>
          <Image source={LIKE} />
          <Image source={COMMENTS} />
        </Card>
      </CardView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const NavBar = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 2px solid #9b59b6;
`;
const NavText = styled.Text`
  color: #9b59b6;
  font-size: 24;
  padding: 8px;
  position: relative;
  left: 50px;
`;

const Image = styled.Image`
  width: 30;
  height: 30;
`;
const Text = styled.Text`
  font-size: 16;
`;

const Setting = styled.TouchableOpacity`
  width: 100;
  background-color: white;
  position: relative;
  left: 160px;
`;

const ProfileView = styled.View`
  padding: 12px;
  align-items: center;
`;

const ProfilePic = styled.Image`
  padding: 15px;
  margin: 10px;
`;

const ProfileText = styled.Text`
  font-size: 16;
  padding: 5px;
`;

const StatsBox = styled.View`
  padding-bottom: 12px;
  margin: 0 11px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StatBox = styled.View`
  margin: 1px 25px;
  align-items: center;
`;

const StatDiff = styled.View`
  width: 2;
  height: 30;
  background-color: #9b59b6;
`;

const CardView = styled.ScrollView.attrs(() => ({
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

export default Profile;