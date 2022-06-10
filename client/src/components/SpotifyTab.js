import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {remote} from 'react-native-spotify-remote';
import getSpotifyToken from '../api/getSpotifyToken';
import MarqueeView from 'react-native-marquee-view';
import {MusicControlBtn} from './MusicControlBtn';
import {useIsFocused} from '@react-navigation/native';

const SpotifyTab = () => {
  const [playIcon, setPlayIcon] = useState(false);
  const isFocused = useIsFocused();
  const [playingMusic, setPlayingMusic] = useState({
    isPaused: true,
    track: {name: '', artist: {name: ''}, duration: ''},
    playbackPosition: null,
  });

  useEffect(() => {
    const getMusic = async () => {
      await getSpotifyToken();
      await getPlayingMusic();
      await timer();
    };
    const setMusic = async () => {
      await getPlayingMusic();
      await timer();
    };
    if (playingMusic.playbackPosition === null) getMusic();
    else setMusic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  // 현재 재생중인 노래 가져오기
  const getPlayingMusic = async () => {
    const infos = await remote.getPlayerState();
    setPlayingMusic({
      ...playingMusic,
      track: {
        name: infos.track.name,
        artist: {name: infos.track.artist.name},
        duration: infos.track.duration,
      },
      playbackPosition: infos.playbackPosition,
    });
    console.log('노래바뀜', infos);
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
      <AlbumImg source={{uri: playingMusic.albumImg}} />
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
