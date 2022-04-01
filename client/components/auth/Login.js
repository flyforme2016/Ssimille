/* eslint-disable prettier/prettier */
import React from 'react';
import {Button, Image, Text, View} from 'react-native';
import KakaoSDK from '@actbase/react-kakaosdk';

const kakaoLogin = async () => {
  try {
    await KakaoSDK.init('71a2f9a5ab9311f766693e041769838a');
    const tokens = await KakaoSDK.login();
    return tokens;
  } catch (e) {
    console.log(e);
  }
};

const Login = () => {
  return (
    <View>
      <Text>SSIMILLE</Text>
      <Button title="kakao" onPress={kakaoLogin} />
    </View>
  );
};

export default Login;
