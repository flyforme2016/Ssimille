import {
    auth as SpotifyAuth,
    remote as SpotifyRemote,
    ApiScope,
} from 'react-native-spotify-remote';

const SpotifyAuthentication = async (parameter) =>{
    const check = parameter
    console.log('Enter SpotifyAuthentication Component');
    console.log('check: ', check)
    const spotifyConfig = {
        clientID: '9912bb2704184ec5acea5688b54c459b',
        clientSecret: 'a060b8460dbd4fdd8e045aac32af1d9c',
        redirectURL: 'http://192.168.0.104:3000/spotify/oauth/callback',
        tokenRefreshURL: 'http://192.168.0.104:3000/spotify/oauth/callback',
        tokenSwapURL: 'http://192.168.0.104:3000/spotify/oauth/callback',
        scopes: [ApiScope.AppRemoteControlScope, ApiScope.UserFollowReadScope],
    };
    const session = await SpotifyAuth.authorize(spotifyConfig)
    return session.accessToken;
}

export default SpotifyAuthentication