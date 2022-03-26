import * as React from 'react';
import {Button, View} from 'react-native';
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
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Login page입니다!</Text>
      <Button title="login button" onPress={kakaoLogin} />
    </View>
  );
};

export default Login;
