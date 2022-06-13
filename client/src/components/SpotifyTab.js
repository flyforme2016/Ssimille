import React, {useEffect, useLayoutEffect, useState} from 'react';
import styled from 'styled-components/native';
import {remote} from 'react-native-spotify-remote';
import MarqueeView from 'react-native-marquee-view';
import {MusicControlBtn} from './MusicControlBtn';
import {useIsFocused} from '@react-navigation/native';
import {
  auth as SpotifyAuth,
  remote as SpotifyRemote,
  ApiScope,
} from 'react-native-spotify-remote';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SpotifyTab = () => {
  const [playIcon, setPlayIcon] = useState(false);
  const isFocused = useIsFocused();
  const [playingMusic, setPlayingMusic] = useState({
    isPaused: true,
    track: {name: '', album: {uri: ''}, artist: {name: ''}, duration: ''},
    playbackPosition: null,
  });
  const [coverImg, setCoverImg] = useState();

  const getMusic = async () => {
    await getSpotifyToken();
    await getPlayingMusic();
    await getAlbumCover();
    await timer();
  };
  useLayoutEffect(() => {
    getMusic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);
  // useLayoutEffect(() => {
  //   const setMusic = async () => {
  //     await getAlbumCover();
  //     await timer();
  //   };
  //   setMusic();
  // }, [playingMusic]);

  const spotifyConfig = {
    clientID: '9912bb2704184ec5acea5688b54c459b',
    redirectURL: 'http://192.168.0.124:3000/spotify/oauth/callback',
    tokenRefreshURL: 'http://192.168.0.124:3000/spotify/oauth/callback',
    tokenSwapURL: 'http://192.168.0.124:3000/spotify/oauth/callback',
    scopes: [ApiScope.AppRemoteControlScope, ApiScope.UserFollowReadScope],
  };

  const getSpotifyToken = async () => {
    try {
      const session = await SpotifyAuth.authorize(spotifyConfig);
      await SpotifyRemote.connect(session.accessToken);
      await AsyncStorage.setItem('spotifyToken', session.accessToken);
      console.log('success authorize');
    } catch (err) {
      console.error(err);
    }
  };

  const getAlbumCover = async () => {
    const SpotifyWebApi = require('spotify-web-api-node');
    const spotifyApi = new SpotifyWebApi({
      clientID: '9912bb2704184ec5acea5688b54c459b',
      clientSecret: 'a060b8460dbd4fdd8e045aac32af1d9c',
      redirectURL: 'http://192.168.0.124:3000/spotify/oauth/callback',
    });
    const spotifyToken = await AsyncStorage.getItem('spotifyToken');
    await spotifyApi.setAccessToken(spotifyToken);

    const uri = await playingMusic.track.album.uri;
    console.log('uri: ', uri);
    //uri 형식 : "spotify:album:3nTPSrFSU515qZW6xASdF7"
    const exp = 'spotify:album:';
    const startIndex = uri.indexOf(exp); //album id 값 parse , 실패하면 -1반환
    const albumUri = uri.substring(startIndex + exp.length);
    console.log(albumUri);
    await spotifyApi.getAlbum(albumUri).then(
      data => {
        const albmImg = data.body.images[0].url;
        setCoverImg(albmImg);
        return albmImg;
      },
      function (err) {
        console.error(err);
      },
    );
  };
  // const searchImg = async () => {
  //   const apiKey = '8d9fa3281b6b3aad9ce7665f929b0048';

  //   const res = await axios
  //     .get(
  //       `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${playingMusic.track.artist.name}&track=${playingMusic.track.name}&format=json`,
  //     )
  //     .then(
  //       async () => {
  //         await setCoverImg(res.data.track.album.image[0]['#text']);
  //         console.log('앨범커버 뽑기위한 api', playingMusic);
  //       },
  //       () => {
  //         console.log('이미지 저장 실패ㅠ');
  //       },
  //     );
  //   console.log(coverImg);
  // };

  // 현재 재생중인 노래 가져오기
  const getPlayingMusic = async () => {
    const infos = await remote.getPlayerState();
    setPlayingMusic({
      ...playingMusic,
      track: {
        name: infos.track.name,
        album: {uri: infos.track.album.uri},
        artist: {name: infos.track.artist.name},
        duration: infos.track.duration,
      },
      playbackPosition: infos.playbackPosition,
    });
  };
  // 노래 변경시에 duration 재설정
  const timer = async () => {
    console.log('setTimeOut 호출');
    const time = await (playingMusic.track.duration / 1 -
      playingMusic.playbackPosition / 1);
    setTimeout(getPlayingMusic, time);
  };

  return (
    <SpotifyTabBar>
      <AlbumImg source={{uri: coverImg}} />
      <MusicInfo>
        {playingMusic.track.name.length > 20 ? (
          <MarqueeView speed={0.2}>
            <MusicName>{playingMusic.track.name}</MusicName>
          </MarqueeView>
        ) : (
          <MusicName>{playingMusic.track.name}</MusicName>
        )}
        <ArtistName>{playingMusic.track.artist.name}</ArtistName>
      </MusicInfo>
      <ContolContainer>
        <MusicControlBtn //이전 곡으로
          onPress={async () => {
            await remote.skipToPrevious();
            await getMusic();
          }}
          type="play-back"
        />
        {!playIcon ? ( //재생 혹은 정지
          <MusicControlBtn
            onPress={async () => {
              setPlayIcon(!playIcon);
              remote.resume();
              await getPlayingMusic();
            }}
            type="play"
          />
        ) : (
          <MusicControlBtn
            onPress={async () => {
              setPlayIcon(!playIcon);
              remote.pause();
              await getPlayingMusic();
            }}
            type="pause"
          />
        )}
        <MusicControlBtn //다음 곡으로
          onPress={async () => {
            await remote.skipToNext();
            await getMusic();
          }}
          type="play-forward"
        />
      </ContolContainer>
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
