import React, {useLayoutEffect, useState} from 'react';
import styled from 'styled-components/native';
import {remote} from 'react-native-spotify-remote';
import MarqueeView from 'react-native-marquee-view';
import {MusicControlBtn} from './MusicControlBtn';
import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import {
  auth as SpotifyAuth,
  remote as SpotifyRemote,
  ApiScope,
} from 'react-native-spotify-remote';
import {useSelector} from 'react-redux';

const SpotifyTab = () => {
  const SpotifyWebApi = require('spotify-web-api-node');

  const [playIcon, setPlayIcon] = useState(false);
  const isFocused = useIsFocused();
  const [playingMusic, setPlayingMusic] = useState({
    isPaused: true,
    track: {name: '', artist: {name: ''}, duration: '', album:{uri: ''}},
    playbackPosition: null,
  });
  const [coverImg, setCoverImg] = useState();
  const spotifyToken = useSelector(state => state.spotifyToken);

  const spotifyWebApi = new SpotifyWebApi({
    clientID: '9912bb2704184ec5acea5688b54c459b',
    clientSecret: 'a060b8460dbd4fdd8e045aac32af1d9c',
    redirectURL: 'http://192.168.0.104:3000/spotify/oauth/callback'
  })

  useLayoutEffect(() => {
    const getMusic = async () => {
      await getSpotifyToken();
      await getPlayingMusic();
      await timer();
    };
    if (playingMusic.playbackPosition === null) getMusic(); //처음에 무조건 spotify에서 재생중인 노래 가져오기 위한 조건
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);
  useLayoutEffect(() => {
    const processAlbumCover = async () => {
      await getAlbumCover();
    }
    if (playingMusic.playbackPosition !== null) processAlbumCover();
  }, [playingMusic])
  
  const getSpotifyToken = async () => {
    try {

      await SpotifyRemote.connect(spotifyToken.spotifyToken);
      // await spotifyWebApi.setAccessToken(spotifyToken.spotifyToken);
      // const checkToken = spotifyWebApi.getAccessToken();
      // console.log('checkToken1: ', checkToken);
      // .then(async () => {
      //   const value = session.accessToken;
      //   await AsyncStorage.setItem('spotifyToken', value);
      //   console.log('success authorize');
      // })
      // .catch(err => {
      //   console.log('err', err);
      // });
    } catch (err) {
      console.error(err);
    }
  };

  // 현재 재생중인 노래 가져오기
  const getPlayingMusic = async () => {
    const infos = await remote.getPlayerState();
    if(infos.isPaused){ //현재 스포티파이에서 노래를 정지중이라면
      setPlayIcon(true)  //재생/정지 버튼 
    }
    setPlayingMusic({
      ...playingMusic,
      track: {
        name: infos.track.name,
        artist: {name: infos.track.artist.name},
        duration: infos.track.duration,
        album: {uri: infos.track.album.uri},
      },
      playbackPosition: infos.playbackPosition,
    });
  };
  // 노래 변경시에 duration 재설정
  const timer = async () => {
    const time = await (playingMusic.track.duration / 1 -
      playingMusic.playbackPosition / 1);
    setTimeout(getPlayingMusic, time);
  };

  const getAlbumCover = async () => {
    const uri = playingMusic.track.album.uri;
    //uri 형식 : "spotify:album:3nTPSrFSU515qZW6xASdF7"
    const exp = 'spotify:album:';
    const startIndex = uri.indexOf(exp); //album id 값 parse , 실패하면 -1반환
    if(startIndex !== -1){
      const albumUri = uri.substring(startIndex + exp.length);
      await spotifyWebApi.setAccessToken(spotifyToken.spotifyToken);
      await spotifyWebApi.getAlbum(albumUri).then(
        data => {
          const albumImg = data.body.images[0].url;
          setCoverImg(albumImg);
          return albumImg;
        }).catch(error=>{
          console.log(error)
        }, 
        error => {
          console.log(error)
        });
    }
  };



  return (
    <SpotifyTabBar>
      <AlbumImg
        source={{uri: coverImg ? coverImg : 'https://ssimille-bucket.s3.ap-northeast-2.amazonaws.com/default/defaultProfileImg.png'}}
      />
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
            await getPlayingMusic();
          }}
          type="play-back"
        />
        {playIcon ? ( 
          <MusicControlBtn //if spotify is pausing should enter here
                           //and if spotify is pausing playIcon is true
            onPress={async () => {
              setPlayIcon(!playIcon);
              remote.resume();
              await getPlayingMusic();
            }}
            type="play"
          />
        ) : (
          <MusicControlBtn //else if playIcon is true enter here
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
            await remote.skipToNext().then(
              async () => {
                await getPlayingMusic();
              },
              () => {
                console.log('then 처리 실패 : 노래정보 업데이트 실패');
              },
            );
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
  width: 60;
  height: 60;
`;
const MusicInfo = styled.View`
  flex-direction: column;
  margin-left: 3px;
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
