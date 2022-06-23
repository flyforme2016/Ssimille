import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React from 'react';
import {View, LogBox, PermissionsAndroid} from 'react-native';
import {WebView} from 'react-native-webview';
import {useDispatch} from 'react-redux';
import actions from '../actions/index';
import SpotifyAuthentication from '../components/SpotifyAuthentication';
import Config from 'react-native-config';
import Geolocation from '@react-native-community/geolocation';

LogBox.ignoreLogs(['Remote debugger']);

const runFirst = `window.ReactNativeWebView.postMessage("this is message from web");`;

const KakaoLogin = ({navigation: {replace}}) => {
  const BASE_URL = Config.BASE_URL;
  const dispatch = useDispatch();

  const getCurrentLocation = async () => {
    // 위치 권한 허용 확인
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //위도 & 경도 불러오는 함수
      Geolocation.getCurrentPosition(
        position => {
          dispatch(actions.saveUserLocation(position.coords));
        },
        error => {
          console.log(error.message);
        },
        {enableHighAccuracy: true, timeout: 15000},
      );
    } else {
      console.log('권한얻기 실패 :', granted);
    }
  };

  const parseAuthCode = async url => {
    console.log('url: ', url);
    const exp = 'code='; //url에 붙어 날라오는 인가코드는 code=뒤부터 parse하여 get
    if (url) {
      const startIndex = url.indexOf(exp); //url에서 "code="으로 시작하는 index를 찾지 못하면 -1반환
      console.log('startIndex: ', startIndex);
      if (startIndex !== -1) {
        const authCode = url.substring(startIndex + exp.length);
        try {
          await axios
            .post(`${BASE_URL}/kakao/oauth/callback`, {
              code: authCode,
            })
            .then(async res => {
              // 스포티파이 연동
              const spotifyToken = await SpotifyAuthentication();
              console.log(
                'Do you receive spotifyToken correctly? : ',
                spotifyToken,
              );
              dispatch(actions.saveSpotifyTokenAction(spotifyToken));
              await getCurrentLocation();

              console.log('return kakaoUid: ', res.data);

              if (res.data.userId) {
                // 최초로그인 시 진입
                console.log('First Login');
                dispatch(actions.saveKakaoUidAction(res.data.userId));
                await AsyncStorage.setItem(
                  'userNumber',
                  JSON.stringify(res.data.userId),
                );
                replace('Stack', {screen: 'Onboarding'});
              } else {
                //최초 로그인이 아닐 시
                console.log('Already Login');
                const myUid = await AsyncStorage.getItem('userNumber');
                console.log('is there myUid in AsyncStorage? : ', myUid);
                dispatch(actions.saveKakaoUidAction(myUid));
                replace('TabBar', {screen: 'Home'});
              }
            });
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      <WebView
        originWhitelist={['*']}
        scalesPageToFit={false}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=1c1252b4d425329642c458690fe99854&redirect_uri=${BASE_URL}/kakao/oauth/callback`,
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
