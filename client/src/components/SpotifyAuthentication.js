import {
    auth as SpotifyAuth,
    remote as SpotifyRemote,
    ApiScope,
} from 'react-native-spotify-remote';
import {useDispatch} from 'react-redux';
import actions from '../actions/index';

const SpotifyAuthentication = ({navigation: {navigate}, route}) =>{
    const check = route.params.isFirstLogin
    console.log('Enter SpotifyAuthentication Component');
    console.log('check: ', check)
    const dispatch = useDispatch();
    const spotifyConfig = {
        clientID: '9912bb2704184ec5acea5688b54c459b',
        clientSecret: 'a060b8460dbd4fdd8e045aac32af1d9c',
        redirectURL: 'http://192.168.0.104:3000/spotify/oauth/callback',
        tokenRefreshURL: 'http://192.168.0.104:3000/spotify/oauth/callback',
        tokenSwapURL: 'http://192.168.0.104:3000/spotify/oauth/callback',
        scopes: [ApiScope.AppRemoteControlScope, ApiScope.UserFollowReadScope],
    };
    const dispatchSpotifyToken = async () =>{
        try {
            const session = await SpotifyAuth.authorize(spotifyConfig)
            dispatch(actions.saveSpotifyTokenAction(session.accessToken))
            if(check){ //최초 로그인 시
                navigate('Stack', {screen: 'Onboarding'})
            }else{ //최초 로그인 아닐 시 바로 Home으로 이동
                navigate('TabBar', {screen: 'Home'});
            }
        }
        catch (error) {
            console.log('dispatchSpotifyToken Fucntion error: ', error);
        }            
    }
    dispatchSpotifyToken()
    
    return(null)
}

export default SpotifyAuthentication