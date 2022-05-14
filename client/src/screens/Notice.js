import React from 'react';
import {Text} from 'react-native';
import {
  auth as SpotifyAuth,
  remote as SpotifyRemote,
  ApiScope,
} from 'react-native-spotify-remote';

const spotifyConfig = {
  clientID: '9912bb2704184ec5acea5688b54c459b',
  redirectURL: 'http://ssimille.com/callback/',
  tokenRefreshURL: 'http://ssimille.com/callback/',
  tokenSwapURL: 'http://ssimille.com/callback/',
  scopes: [ApiScope.AppRemoteControlScope, ApiScope.UserFollowReadScope],
};

const Notice = async () => {
  try {
    const session = await SpotifyAuth.authorize(spotifyConfig);
    console.log(session);
    await SpotifyRemote.connect(session.accessToken);
    await SpotifyRemote.playUri('spotify:track:6IA8E2Q5ttcpbuahIejO74');
    await SpotifyRemote.seek(58000);
  } catch (err) {
    console.error("Couldn't authorize with or connect to Spotify", err);
  }
  return <Text>Notice</Text>;
};

export default Notice;
