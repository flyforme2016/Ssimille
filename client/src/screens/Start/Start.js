import React from 'react';
import styled from 'styled-components/native';
import {CustomButton} from '../../components/CustomButtons';

const Start = ({navigation}) => {
  return (
    <Container>
      <BackgroundImg source={require('../../assets/sample/background.jpg')} />
      <Logo source={require('../../assets/SSimille.png')} />
      <CustomButton
        text="시작하기"
        onPress={() => navigation.replace('Stack', {screen: 'KakaoLogin'})}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  align-items: center;
`;

const BackgroundImg = styled.ImageBackground`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Logo = styled.Image`
  width: 400;
  height: 400;
`;

export default Start;
