import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {remote} from 'react-native-spotify-remote';
import MarqueeView from 'react-native-marquee-view';
import {MusicControlBtn} from './MusicControlBtn';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import {useMutation, useQuery} from 'react-query';
import getRef from '../functions/getRef';
import updateCurrentMusic from '../functions/updateCurrentMusic';
import {DeviceEventEmitter} from 'react-native';

const SPOTIFY_CLIENT_ID = Config.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = Config.SPOTIFY_CLIENT_SECRET;
const BASE_URL = Config.BASE_URL;

const SpotifyTab = () => {
  const {spotifyToken} = useSelector(state => state.spotifyToken);
  const {myProfileData} = useSelector(state => state.myProfile);
  const SpotifyWebApi = require('spotify-web-api-node');
  const spotifyWebApi = new SpotifyWebApi({
    clientID: `${SPOTIFY_CLIENT_ID}`,
    clientSecret: `${SPOTIFY_CLIENT_SECRET}`,
    redirectURL: `${BASE_URL}/spotify/oauth/callback`,
  });

  useEffect(() => {
    DeviceEventEmitter.addListener('refetchMusic', async () => {
      console.log('music refetch');
      await refetch();
      if (!isLoading) {
        const regionCode = myProfileData.region_code.toString();
        const myUid = myProfileData.kakao_user_number.toString();
        const currentMusicDocRef = getRef.currentMusicDocRef(regionCode, myUid);
        updateCurrentMusic(currentMusicDocRef, myProfileData, CurrentMusic);
      }
    });
  }, []);

  const {
    isLoading,
    data: CurrentMusic,
    refetch,
  } = useQuery(
    'CurrentMusic',
    async () => {
      await remote.connect(spotifyToken);
      const data = await remote.getPlayerState();
      console.log('useQuery refetch');
      return data;
    },
    {
      onSuccess: async data => {
        const uri = data.track.album.uri;
        const exp = 'spotify:album:';
        const startIndex = uri.indexOf(exp); //album id 값 parse , 실패하면 -1반환
        const albumUri = uri.substring(startIndex + exp.length);

        await spotifyWebApi.setAccessToken(spotifyToken);
        await spotifyWebApi.getAlbum(albumUri).then(img => {
          const albumImg = img.body.images[0].url;
          setCoverImg(albumImg);
        });
      },
    },
  );

  const [coverImg, setCoverImg] = useState();

  return (
    <SpotifyTabBar>
      {!isLoading && (
        <>
          <AlbumImg
            source={{
              uri: coverImg ? coverImg : null,
            }}
          />
          <MusicInfo>
            {CurrentMusic.track.name.length > 20 ? (
              <MarqueeView speed={0.2}>
                <MusicName>{CurrentMusic.track.name}</MusicName>
              </MarqueeView>
            ) : (
              <MusicName>{CurrentMusic.track.name}</MusicName>
            )}
            <ArtistName>{CurrentMusic.track.artist.name}</ArtistName>
          </MusicInfo>
          <ContolContainer>
            <MusicControlBtn //이전 곡으로
              onPress={async () => {
                await remote.skipToPrevious();
                DeviceEventEmitter.emit('refetchMusic');
              }}
              type="play-back"
            />
            {CurrentMusic.isPaused ? (
              <MusicControlBtn //if spotify is pausing should enter here
                //and if spotify is pausing playIcon is true
                onPress={async () => {
                  remote.resume();
                }}
                type="play"
              />
            ) : (
              <MusicControlBtn //else if playIcon is true enter here
                onPress={async () => {
                  remote.pause();
                }}
                type="pause"
              />
            )}
            <MusicControlBtn //다음 곡으로
              onPress={async () => {
                await remote.skipToNext();
                DeviceEventEmitter.emit('refetchMusic');
              }}
              type="play-forward"
            />
          </ContolContainer>
        </>
      )}
    </SpotifyTabBar>
  );
};

const SpotifyTabBar = styled.View`
  width: 100%;
  margin-left: 5px;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
`;

const AlbumImg = styled.Image`
  margin: 0 5px;
  width: 50;
  height: 50;
`;
const MusicInfo = styled.View`
  flex-direction: column;
  margin-left: 5px;
  width: 170px;
  height: 30;
`;
const MusicName = styled.Text`
  font-size: 12px;
`;
const ArtistName = styled.Text`
  font-size: 10px;
`;
const ContolContainer = styled.View`
  position: absolute;
  right: -1;
  margin-right: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export default SpotifyTab;
