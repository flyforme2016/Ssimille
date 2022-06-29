import React from 'react';
import styled from 'styled-components/native';
import CustomButton from '../../components/CustomButtons';
const backImage = require('../../assets/sample/background.jpg');
const Logo = require('../../assets/SSimille.png');

const Login = ({navigation}) => {
  return (
    <Container source={backImage}>
      <ImageView>
        <Image source={Logo} />
      </ImageView>
      <ButtonView>
        <CustomButton
          text={'카카오 로그인'}
          onPress={() => navigation.navigate('KakaoLogin')}
        />
      </ButtonView>
    </Container>
  );
};
const Container = styled.ImageBackground`
  flex: 1;
  width: 100%;
  background-color: '#fff';
`;
const ImageView = styled.View`
  justify-content: flex-end;
  align-items: center;
`;
const ButtonView = styled.View`
  flex: 0.8;
  justify-content: flex-end;
  align-items: center;
`;
const Image = styled.Image`
  width: 400;
  height: 400;
`;
export default Login;
