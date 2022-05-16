import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  auth as SpotifyAuth,
  remote as SpotifyRemote,
  ApiScope,
} from 'react-native-spotify-remote';

const spotifyConfig = {
  clientID: '9912bb2704184ec5acea5688b54c459b',
  redirectURL: 'http://192.168.0.104:3000/spotify/oauth/callback',
  tokenRefreshURL: 'http://192.168.0.104:3000/spotify/oauth/callback',
  tokenSwapURL: 'http://192.168.0.104:3000/spotify/oauth/callback',
  scopes: [ApiScope.AppRemoteControlScope, ApiScope.UserFollowReadScope],
};

const SpotifyLogin = () => {
  const [loginState, setLoginState] = useState(false);
  const [playIcon, setPlayIcon] = useState(false);

  const handleLogin = async () => {
    try {
      console.log('try login');
      const session = await SpotifyAuth.authorize(spotifyConfig);
      await SpotifyRemote.connect(session.accessToken);
      await SpotifyRemote.playUri('spotify:track:6IA8E2Q5ttcpbuahIejO74');
      const isconnected = await SpotifyRemote.isConnectedAsync();
      setLoginState(isconnected);
      console.log('login sucess');
    } catch (err) {
      console.error(err);
    }
  };

  const recommendedMusic = async () => {
    await SpotifyRemote.getRecommendedContentItems();
  };

  useEffect(() => {
    handleLogin();
  });

  return loginState ? (
    <>
      {/* <Btn style={{width: 100, height: 100}} onPress={recommendedMusic}>
        <Text style={{fontSize: 12}}>음악 추천</Text>
      </Btn> */}
      <SpotifyTabBar>
        <AlbumImg source={require('../assets/sample/2.jpg')} />
        <MusicInfo>
          <MusicName> 노래 제목</MusicName>
          <ArtistName> 가수이름</ArtistName>
        </MusicInfo>
        <ContolContainer>
          <ControlBtn
            onPress={() => {
              setPlayIcon(!playIcon);
              SpotifyRemote.skipToPrevious();
            }}>
            <Ionicons name="play-back" size={30} />
          </ControlBtn>
          {playIcon ? (
            <ControlBtn
              onPress={() => {
                setPlayIcon(!playIcon);
                SpotifyRemote.pause();
              }}>
              <Ionicons name="pause" size={30} />
            </ControlBtn>
          ) : (
            <ControlBtn
              onPress={() => {
                setPlayIcon(!playIcon);
                SpotifyRemote.resume();
              }}>
              <Ionicons name="play" size={30} />
            </ControlBtn>
          )}
          <ControlBtn
            onPress={() => {
              setPlayIcon(!playIcon);
              SpotifyRemote.skipToNext();
            }}>
            <Ionicons name="play-forward" size={30} />
          </ControlBtn>
        </ContolContainer>
      </SpotifyTabBar>
    </>
  ) : (
    <Text>loading...</Text>
  );
};

const SpotifyTabBar = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  position: absolute;
`;
const AlbumImg = styled.Image`
  width: 70;
  height: 70;
  margin: 12px;
  border-radius: 20px;
  border: 2px solid gray;
`;
const MusicInfo = styled.View`
  margin: 6px;
`;
const MusicName = styled.Text`
  font-size: 14px;
`;
const ArtistName = styled.Text`
  font-size: 12px;
`;
const ContolContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
`;
const ControlBtn = styled.TouchableOpacity`
  width: 50;
`;
const Text = styled.Text`
  font-size: 24px;
`;
export default SpotifyLogin;
