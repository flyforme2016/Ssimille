import React from 'react';
import Config from 'react-native-config';
import {auth as SpotifyAuth, ApiScope} from 'react-native-spotify-remote';
import {ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch} from 'react-redux';
import actions from '../actions/index';

const SPOTIFY_CLIENT_ID = Config.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = Config.SPOTIFY_CLIENT_SECRET;
const BASE_URL = Config.BASE_URL;

const SpotifyAuthentication = ({navigation}) => {
  console.log('Enter SpotifyAuthentication');
  const dispatch = useDispatch();
  const spotifyConfig = {
    clientID: `${SPOTIFY_CLIENT_ID}`,
    clientSecret: `${SPOTIFY_CLIENT_SECRET}`,
    redirectURL: `${BASE_URL}/spotify/oauth/callback`,
    tokenRefreshURL: `${BASE_URL}/spotify/refresh`,
    tokenSwapURL: `${BASE_URL}/spotify/swap`,
    scopes: [ApiScope.AppRemoteControlScope, ApiScope.UserFollowReadScope],
  };
  const getToken = async () => {
    const session = await SpotifyAuth.authorize(spotifyConfig);
    dispatch(actions.saveSpotifyTokenAction(session.accessToken));
  };
  try {
    getToken();
    navigation.goBack();
  } catch (error) {
    console.log('errer', error);
  }
  return (
    <Loader>
      <ActivityIndicator />
    </Loader>
  );
};

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export default SpotifyAuthentication;
