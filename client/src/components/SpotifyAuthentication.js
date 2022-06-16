import {
  auth as SpotifyAuth,
  remote as SpotifyRemote,
  ApiScope,
} from 'react-native-spotify-remote';
import {useDispatch} from 'react-redux';
import actions from '../actions/index';

const SpotifyAuthentication = ({navigation: {navigate}}) => {
  console.log('Enter SpotifyAuthentication Component');
  const dispatch = useDispatch();
  const spotifyConfig = {
    clientID: '9912bb2704184ec5acea5688b54c459b',
    clientSecret: 'a060b8460dbd4fdd8e045aac32af1d9c',
    redirectURL: 'http://192.168.0.104:3000/spotify/oauth/callback',
    tokenRefreshURL: 'http://192.168.0.104:3000/spotify/oauth/callback',
    tokenSwapURL: 'http://192.168.0.104:3000/spotify/oauth/callback',
    scopes: [ApiScope.AppRemoteControlScope, ApiScope.UserFollowReadScope],
  };
  const dispatchSpotifyToken = async () => {
    try {
      const session = await SpotifyAuth.authorize(spotifyConfig);
      dispatch(actions.saveSpotifyTokenAction(session.accessToken));
      navigate('TabBar', {screen: 'MyProfile'});
    } catch (error) {
      console.log('dispatchSpotifyToken Fucntion error: ', error);
    }
  };
  dispatchSpotifyToken();

  return null;
};

export default SpotifyAuthentication;
