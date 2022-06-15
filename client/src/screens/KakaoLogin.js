import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React from 'react';
import {View, LogBox} from 'react-native';
import {WebView} from 'react-native-webview';
import getSpotifyToken from '../api/getSpotifyToken';

LogBox.ignoreLogs(['Remote debugger']);

const runFirst = `window.ReactNativeWebView.postMessage("this is message from web");`;

const KakaoLogin = ({navigation: {navigate}}) => {
  const parseAuthCode = async url => {
    const exp = 'code='; //url에 붙어 날라오는 인가코드는 code=뒤부터 parse하여 get
    const startIndex = url.indexOf(exp); //url에서 "code="으로 시작하는 index를 찾지 못하면 -1반환
    if (startIndex !== -1) {
      const authCode = url.substring(startIndex + exp.length);
      //console.log('access code :: ' + authCode);
      try {
        await axios
          .post('http://192.168.0.124:3000/kakao/oauth/callback', {
            code: authCode,
          })
          .then(async res => {
            dispatch(actions.saveKakaoUidAction(res.data.userId))
            await AsyncStorage.setItem(
              'userNumber',
              JSON.stringify(res.data.userId),
            );
            await getSpotifyToken();
          });
      } catch (err) {
        console.log(err);
      }
      navigate('Stack', {screen: 'SpotifyAuthentication'});
    }
  };

  return (
    <View style={{flex: 1}}>
      <WebView
        originWhitelist={['*']}
        scalesPageToFit={false}
        source={{
          uri: 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=1c1252b4d425329642c458690fe99854&redirect_uri=http://192.168.0.124:3000//kakao/oauth/callback',
        }}
        injectedJavaScript={runFirst}
        javaScriptEnabled={true}
        onMessage={event => {
          parseAuthCode(event.nativeEvent['url']);
        }}

        // onMessage ... :: webview에서 온 데이터를 event handler로 잡아서 logInProgress로 전달
      />
    </View>
  );
};

export default KakaoLogin;
