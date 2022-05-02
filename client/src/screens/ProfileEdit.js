/* eslint-disable prettier/prettier */
import React from 'react';
import {
  View,
  StatusBar,
  Image,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import styled from 'styled-components/native';

import Music from '../profilemusic.png';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButtons';

const SUBMIT = {
  uri: 'https://cdn0.iconfinder.com/data/icons/ui-elements-03/64/Upload-arrow-up-submit-128.png',
  width: 30,
  height: 30,
};
const AVARTA = {
  uri: 'https://cdn4.iconfinder.com/data/icons/outlines-business-web-optimization/256/1-89-128.png',
  width: 70,
  height: 70,
};
const PLUS = {
  uri: 'https://cdn0.iconfinder.com/data/icons/mobile-basic-vol-1/32/Circle_Plus-128.png',
  width: 35,
  height: 35,
};
const COMMENTS = {
  uri: 'https://cdn4.iconfinder.com/data/icons/network-and-communication-2-10/48/78-128.png',
  width: 20,
  height: 20,
};

const ProfileEdit = ({navigation: {navigate}}) => {
  return (
    <Container>
      <NavBar>
  
      <NavText bold size="25px">
        PROFILE EDIT
      </NavText>
      <Setting onPress={() => navigate('Stack', {screen: 'Profile'})}>
      <Image source={SUBMIT} />
      </Setting>
    </NavBar>


      <ScrollView contentContainerStyle={{alignItems: 'center'}}>
        <Image source={AVARTA} />
        <CustomInput placeholder="이명희" style={{height: 50, width: 150}} />
        <CustomButton text="프로필뮤직변경" />
        <CustomInput
          placeholder="안녕하세요 인천에 살고있는 26살 이명희 입니다!"
          style={{height: 150, width: 300}}
        />
        <NavBarView>
          <Text style={{marginTop: 30,height :70 }}>애청곡 편집 </Text>
          <Logo2 source={PLUS} />
        </NavBarView>
        <Logo1 source={Music} />
      </ScrollView>
    </Container>
  );
};
const Container = styled.View`
  flex: 1;

`;
const NavBarView = styled.View`
  height: 76px;
  margin: 0px 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const Text = styled.Text`
  color: ${props => (props.color ? props.color : '#9b59b6')};
  font-size: ${props => (props.size ? props.size : '22px')};
  line-height: ${props => (props.height ? props.height : '24px')};
  font-weight: ${props => (props.bold ? 'bold' : 'normal')};
  position: relative;
  left: 15px;
`;

const NavText = styled.Text`
  color: #9b59b6;
  font-size: 24;
  padding: 8px;
  position: relative;
  left: 50px;
`;

const Logo = styled.Image`
  width: 100;
  height: 100;
`;

const Logo1 = styled.Image`
  width: 300;
  height: 270;
`;

const Logo2 = styled.Image`
  position: relative;
  left: 80px;
  bottom: 5px;
`;

const Setting = styled.TouchableOpacity`
  width: 100;
  background-color: white;
  position: relative;
  left: 130px;
`;

const NavBar = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
 
`;

export default ProfileEdit;