import AsyncStorage from '@react-native-async-storage/async-storage';
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

const getSpotifyToken = async () => {
  const session = await SpotifyAuth.authorize(spotifyConfig);
  await SpotifyRemote.connect(session.accessToken);
  await AsyncStorage.setItem('spotifyToken', session.accessToken);
  console.log('success authorize');
};

export default getSpotifyToken;
