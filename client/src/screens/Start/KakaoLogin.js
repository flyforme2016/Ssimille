import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React from 'react';
import {View, PermissionsAndroid, Platform} from 'react-native';
import {WebView} from 'react-native-webview';
import {useDispatch} from 'react-redux';
import actions from '../../actions/index';
import Config from 'react-native-config';
import Geolocation from '@react-native-community/geolocation';
import {check, PERMISSIONS, request} from 'react-native-permissions';

const runFirst = `window.ReactNativeWebView.postMessage("this is message from web");`;

const KakaoLogin = ({navigation: {navigate, replace}}) => {
  const BASE_URL = Config.BASE_URL;
  const dispatch = useDispatch();
  const getCurrentLocation = async () => {
    let granted;
    // 위치 권한 허용 확인
    if (Platform.OS === 'android') {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //위도 & 경도 불러오는 함수
        Geolocation.getCurrentPosition(position => {
          console.log("position.coords : ", position.coords)
          dispatch(actions.saveUserLocation(position.coords));
        });
      }
    } else {
      await request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(() => {
        check(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
          result === 'granted'
            ? Geolocation.getCurrentPosition(position => {
                dispatch(actions.saveUserLocation(position.coords));
              })
            : console.log('denied', result);
        });
      });
    }
  };

  const parseAuthCode = async nativeEvent => {
    const exp = 'code='; //url에 붙어 날라오는 인가코드는 code=뒤부터 parse하여 get
    if (Platform.OS == 'ios') {
      if (nativeEvent.url) {
        const startIndex = nativeEvent.url.indexOf(exp); //url에서 "code="으로 시작하는 index를 찾지 못하면 -1반환

        if (startIndex !== -1) {
          const authCode = nativeEvent.url.substring(startIndex + exp.length);
          try {
            console.log("check");
            await axios
              .post(`${BASE_URL}/kakao/oauth`, {
                code: authCode,
              })
              .then(async res => {
                // 스포티파이 연동
                console.log("res.data.userId : ", res.data.userId);
                navigate('Stack', {screen: 'SpotifyAuthentication'});
                await getCurrentLocation();
                if (res.data.userId) {
                  // 최초로그인 시 진입
                  dispatch(actions.saveKakaoUidAction(res.data.userId));
                  await AsyncStorage.setItem(
                    'userNumber',
                    JSON.stringify(res.data.userId),
                  );
                  replace('Stack', {screen: 'Introduce'});
                } else {
                  //최초 로그인이 아닐 시
                  const myUid = await AsyncStorage.getItem('userNumber');
                  dispatch(actions.saveKakaoUidAction(myUid));
                  replace('Stack', {screen: 'MyZone'});
                }
              });
          } catch (err) {
            console.log(err);
          }
        }
      }
    } else if (nativeEvent.title) {
      const startIndex = nativeEvent.title.indexOf(exp); //url에서 "code="으로 시작하는 index를 찾지 못하면 -1반환

      if (startIndex !== -1) {
        const authCode = nativeEvent.title.substring(startIndex + exp.length);
        try {
          await axios
            .post(`${BASE_URL}/kakao/oauth`, {
              code: authCode,
            })
            .then(async res => {
              // 스포티파이 연동
              navigate('Stack', {screen: 'SpotifyAuthentication'});
              await getCurrentLocation();
              if (res.data.userId) {
                // 최초로그인 시 진입
                dispatch(actions.saveKakaoUidAction(res.data.userId));
                await AsyncStorage.setItem(
                  'userNumber',
                  JSON.stringify(res.data.userId),
                );
                replace('Stack', {screen: 'Introduce'});
              } else {
                //최초 로그인이 아닐 시
                const myUid = await AsyncStorage.getItem('userNumber');
                dispatch(actions.saveKakaoUidAction(myUid));
                replace('Stack', {screen: 'MyZone'});
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
          parseAuthCode(event.nativeEvent);
        }}
        // onMessage ... :: webview에서 온 데이터를 event handler로 잡아서 logInProgress로 전달
      />
    </View>
  );
};

export default KakaoLogin;
