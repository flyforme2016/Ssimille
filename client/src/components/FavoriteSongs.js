import React from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import getSpotifyToken from '../api/getSpotifyToken';
import {remote} from 'react-native-spotify-remote';
import {MusicControlBtn} from './MusicControlBtn';

const FavoriteSongs = ({navigation}) => {
  const data = [
    {
      preview_url:
        'https://i.scdn.co/image/ab67616d0000b273b1e699e6e60ec54bbf0b7e8f',
      name: 'Gashina',
      artist: 'SUNMI',
      musicUri: 'spotify:track:7csMuPqdOPaFKby0AoRYL5',
    },
    {
      preview_url:
        'https://i.scdn.co/image/ab67616d0000b273b1e699e6e60ec54bbf0b7e8f',
      name: 'Gashina',
      artist: 'SUNMI',
      musicUri: 'spotify:track:7csMuPqdOPaFKby0AoRYL5',
    },
    {
      preview_url:
        'https://i.scdn.co/image/ab67616d0000b273b1e699e6e60ec54bbf0b7e8f',
      name: 'Gashina',
      artist: 'SUNMI',
      musicUri: 'spotify:track:7csMuPqdOPaFKby0AoRYL5',
    },
    {
      preview_url:
        'https://i.scdn.co/image/ab67616d0000b273b1e699e6e60ec54bbf0b7e8f',
      name: 'Gashina',
      artist: 'SUNMI',
      musicUri: 'spotify:track:7csMuPqdOPaFKby0AoRYL5',
    },
  ];
  return (
    <Container>
      <NavBar>
        <MusicUploadBtn
          onPress={async () => {
            console.log('clicked');
            await getSpotifyToken();
            navigation.navigate('Stack', {
              screen: 'SearchMusic',
              params: {
                page: 'Profile',
              },
            });
          }}>
          <Ionicons name="add" size={25} />
        </MusicUploadBtn>
        <NavText>음악 추가하기</NavText>
      </NavBar>

      <MusicResultList
        data={data}
        keyExtractor={item => item.id + ''}
        horizontal={false}
        renderItem={({item}) => (
          <Card>
            <MusicInfoContainer
              onPress={() => {
                console.log('애청곡 눌림');
              }}>
              <MusicWrapper>
                <CoverImg source={{uri: item.preview_url}} />
                <MusicInfo>
                  <MusicName>{item.name}</MusicName>
                  <ArtistName>{item.artist}</ArtistName>
                </MusicInfo>
              </MusicWrapper>
              <MusicControlBtn
                onPress={async () => {
                  await getSpotifyToken();
                  await remote.playUri(item.musicUri);
                }}
                type="play"
              />
            </MusicInfoContainer>
          </Card>
        )}
      />
    </Container>
  );
};
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const NavBar = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const NavText = styled.Text`
  font-size: 16px;
  padding: 8px;
`;
const MusicUploadBtn = styled.TouchableOpacity`
  padding: 8px;
`;

const MusicResultList = styled.FlatList``;

const Card = styled.View`
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
  margin: 5px 20px;
  border-radius: 10px;
  elevation: 3;
`;

const MusicInfoContainer = styled.TouchableOpacity`
  width: 80%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-content: space-around;
  padding: 12px;
`;

const MusicWrapper = styled.View`
  flex-direction: row;
  margin: 0 8px;
`;
const CoverImg = styled.Image`
  width: 50px;
  height: 50px;
`;
const MusicInfo = styled.View`
  flex-direction: column;
  justify-content: center;
  margin: 0 15px;
`;

const MusicName = styled.Text`
  font-size: 14px;
  font-weight: bold;
`;

const ArtistName = styled.Text`
  font-size: 12px;
`;

export default FavoriteSongs;
