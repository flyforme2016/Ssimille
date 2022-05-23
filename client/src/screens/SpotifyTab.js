import React, {useLayoutEffect, useState} from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {remote} from 'react-native-spotify-remote';
import getSpotifyToken from '../api/getSpotifyToken';
import MarqueeView from 'react-native-marquee-view';

const SpotifyTab = () => {
  const [playIcon, setPlayIcon] = useState(false);
  const [currentAlbumImg, setCurrentAlbumImg] = useState();
  const [currentSongName, setCurrentSongName] = useState();
  const [currentArtist, setcurrentArtist] = useState();
  const test = async () => {
    try {
      await getSpotifyToken();
      remote.getPlayerState().then(infos => {
        const currentMusic = infos.track;
        setCurrentSongName(currentMusic.name);
        setcurrentArtist(currentMusic.artist.name);
      });

      const token =
        'BQCPa8QFWx55-M3wO8MixVgnHDpluLYpCHY-f_dIqlkVk4G3DQ17l20n6iQO0_psnwDIHWJd8LE7Fu3FLFk1CwwyCW4GTU_CCwJfFe5AYiA4o1B6w1Ahbg5UZbhBaXZF3X4MpdY4ExzSV7_jhQEl3z4iyr3rsEyBXuAPyWoBl221';

      const requestOptions = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // await fetch(
      //   'https://api.spotify.com/v1/albums/1Xi55xFMaymXdSWshmxhw2',
      //   requestOptions,
      // )
      //   .then(res => {
      //     console.log('res: ', res);
      //     const AlbumImg = res[0];
      //     setCurrentAlbumImg(AlbumImg);
      //   })
      //   .catch(err => {
      //     console.log('err: ', err);
      //   });
    } catch (err) {
      console.log(err);
    }
  };
  useLayoutEffect(() => {
    test();
  }, []);

  return (
    <SpotifyTabBar>
      <AlbumImg source={{uri: currentAlbumImg}} />

      <MusicInfo>
        <MarqueeView speed={0.2}>
          <MusicName>{currentSongName}</MusicName>
        </MarqueeView>
        <ArtistName> {currentArtist}</ArtistName>
      </MusicInfo>

      <ContolContainer>
        <ControlBtn
          onPress={() => {
            remote.skipToPrevious();
          }}>
          <Ionicons name="play-back" size={20} />
        </ControlBtn>
        {playIcon ? (
          <ControlBtn
            onPress={() => {
              setPlayIcon(!playIcon);
              remote.pause();
            }}>
            <Ionicons name="pause" size={20} />
          </ControlBtn>
        ) : (
          <ControlBtn
            onPress={() => {
              setPlayIcon(!playIcon);
              remote.resume();
            }}>
            <Ionicons name="play" size={20} />
          </ControlBtn>
        )}
        <ControlBtn
          onPress={() => {
            remote.skipToNext();
          }}>
          <Ionicons name="play-forward" size={20} />
        </ControlBtn>
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
const ControlBtn = styled.TouchableOpacity`
  margin: 5px;
`;

export default SpotifyTab;
