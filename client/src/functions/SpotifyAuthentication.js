import Config from 'react-native-config';
import {auth as SpotifyAuth, ApiScope} from 'react-native-spotify-remote';
const SPOTIFY_CLIENT_ID = Config.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = Config.SPOTIFY_CLIENT_SECRET;
const BASE_URL = Config.BASE_URL;

const SpotifyAuthentication = async () => {
  const spotifyConfig = {
    clientID: `${SPOTIFY_CLIENT_ID}`,
    clientSecret: `${SPOTIFY_CLIENT_SECRET}`,
    redirectURL: `${BASE_URL}/spotify/oauth/callback`,
    tokenRefreshURL: `${BASE_URL}/spotify/oauth/callback`,
    tokenSwapURL: `${BASE_URL}/spotify/oauth/callback`,
    scopes: [
      ApiScope.AppRemoteControlScope,
      ApiScope.UserFollowReadScope,
      ApiScope.UserReadRecentlyPlayedScope,
    ],
  };
  const session = await SpotifyAuth.authorize(spotifyConfig);

  return session.accessToken;
};

export default SpotifyAuthentication;
