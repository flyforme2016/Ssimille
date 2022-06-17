import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';

const SearchMusic = ({navigation, route}) => {
  const SpotifyWebApi = require('spotify-web-api-node');
  const spotifyApi = new SpotifyWebApi({
    clientID: '9912bb2704184ec5acea5688b54c459b',
    clientSecret: 'a060b8460dbd4fdd8e045aac32af1d9c',
    redirectURL: 'http://192.168.0.124:3000/spotify/oauth/callback',
  });
  const [searchName, setSearchName] = useState();
  const [data, setData] = useState();

  const searchMusic = async () => {
    const token = await AsyncStorage.getItem('spotifyToken');
    await spotifyApi.setAccessToken(token);

    await spotifyApi.searchTracks(searchName).then(
      data => {
        console.log('곡 정보', data.body.tracks.items);
        setData(data.body.tracks.items);
      },
      err => {
        console.error(err);
      },
    );
  };
  return (
    <Container>
      <SearchContainer>
        <SearchInput
          placeholder="음악을 검색해주세요"
          value={searchName}
          onChangeText={text => setSearchName(text)}
        />
        <SearchBtn
          onPress={async () => {
            await searchMusic();
          }}>
          <Ionicons name="search" size={30} />
        </SearchBtn>
      </SearchContainer>
      <MusicResultList
        data={data}
        keyExtractor={item => item.id + ''}
        horizontal={false}
        renderItem={({item}) => (
          <Card>
            <MusicInfoContainer
              onPress={() => {
                console.log(item);

                navigation.navigate({
                  name: route.params.page,
                  params: {
                    albumTitle: item.name,
                    albumArtistName: item.artists[0].name,
                    albumImg: item.album.images[0].url,
                    musicUri: item.uri,
                  },
                  merge: true,
                });
              }}>
              <CoverImg source={{uri: item.album.images[0].url}} />
              <MusicInfo>
                <MusicName>{item.name}</MusicName>
                <ArtistName>{item.artists[0].name}</ArtistName>
              </MusicInfo>
            </MusicInfoContainer>
          </Card>
        )}
      />
    </Container>
  );
};

const Container = styled.View`
  align-items: center;
`;
const SearchContainer = styled.View`
  margin: 7px 0;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const SearchInput = styled.TextInput`
  width: 70%;
  margin: 10px;
  padding: 12px;
  border-radius: 10px;
  background-color: white;
`;

const SearchBtn = styled.TouchableOpacity``;

const MusicResultList = styled.FlatList`
  width: 90%;
`;

const Card = styled.View`
  background-color: #ffffff;
  justify-content: center;
  margin: 5px 0;
  border-radius: 10px;
  elevation: 3;
`;

const MusicInfoContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-start;
  padding: 15px;
`;

const CoverImg = styled.Image`
  width: 50px;
  height: 50px;
`;
const MusicInfo = styled.View`
  flex-direction: column;
  justify-content: center;
  margin-left: 15px;
`;

const MusicName = styled.Text`
  font-size: 14px;
  font-weight: bold;
`;

const ArtistName = styled.Text`
  font-size: 12px;
  margin-top: 10px;
`;

export default SearchMusic;