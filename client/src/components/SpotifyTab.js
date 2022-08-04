import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import {remote} from 'react-native-spotify-remote';
import {MusicControlBtn} from './CustomButtons';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import {useQuery} from 'react-query';
import getRef from '../functions/getRef';
import updateCurrentMusic from '../functions/updateCurrentMusic';

const SPOTIFY_CLIENT_ID = Config.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = Config.SPOTIFY_CLIENT_SECRET;
const BASE_URL = Config.BASE_URL;

const SpotifyWebApi = require('spotify-web-api-node');
const spotifyWebApi = new SpotifyWebApi({
  clientID: `${SPOTIFY_CLIENT_ID}`,
  clientSecret: `${SPOTIFY_CLIENT_SECRET}`,
  redirectURL: `${BASE_URL}/spotify/oauth/callback`,
});

const SpotifyTab = () => {
  const {spotifyToken} = useSelector(state => state.spotifyToken);
  const {myProfileData} = useSelector(state => state.myProfile);
  useEffect(() => {
    //useQuery 이후 useEffect에 두번 진입하여
    //listener가 쌓이기 때문에 listener가 없을 경우에만 생성하도록 수정.
    if (remote.listenerCount('playerStateChanged') === 0) {
      remote.addListener('playerStateChanged', () => {
        /*
        remote.addListener가 생성 뿐만 아니라 emit역할을 동시에 수행함.
        playerStateChanged가 발생할 때 마다 listener를 생성하여 여러개의 listener가 쌓임
        따라서 listener를 한개로 유지하기 위해 remove를 항상 해주어야 함.
        */
        remote.removeAllListeners('playerStateChanged');
        refetch();
      });
    }
  });

  const {data: CurrentMusic, refetch} = useQuery(
    ['CurrentMusic'],
    async () => {
      await remote.connect(spotifyToken);
      const data = await remote.getPlayerState();
      const uri = data.track.album.uri;
      const exp = 'spotify:album:';
      const startIndex = uri.indexOf(exp); //album id 값 parse , 실패하면 -1반환
      const albumUri = uri.substring(startIndex + exp.length);
      await spotifyWebApi.setAccessToken(spotifyToken);
      await spotifyWebApi.getAlbum(albumUri).then(img => {
        data.albumImg = img.body.images[0].url;
      });
      if (!data.isPaused) {
        const regionCode = myProfileData.region_code.toString();
        const myUid = myProfileData.kakao_user_number.toString();
        const currentMusicDocRef = getRef.currentMusicDocRef(regionCode, myUid);
        updateCurrentMusic(currentMusicDocRef, myProfileData, data);
      }

      return data;
    },

    {
      staleTime: Infinity,
    },
  );

  return (
    <SpotifyTabBar>
      {CurrentMusic && (
        <>
          <AlbumImg
            source={{
              uri: CurrentMusic.albumImg,
            }}
          />
          <MusicInfo>
            {CurrentMusic.track.name.length > 25 ? (
              <MusicName>{CurrentMusic.track.name.slice(0, 25)}...</MusicName>
            ) : (
              <MusicName>{CurrentMusic.track.name}</MusicName>
            )}
            <ArtistName>{CurrentMusic.track.artist.name}</ArtistName>
          </MusicInfo>

          <ContolContainer>
            <MusicControlBtn //이전 곡으로
              onPress={async () => {
                await remote.skipToPrevious();
              }}
              type="play-back"
            />
            {CurrentMusic.isPaused ? (
              <MusicControlBtn
                onPress={async () => {
                  remote.resume();
                }}
                type="play"
              />
            ) : (
              <MusicControlBtn
                onPress={async () => {
                  remote.pause();
                }}
                type="pause"
              />
            )}
            <MusicControlBtn //다음 곡으로
              onPress={async () => {
                await remote.skipToNext();
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
