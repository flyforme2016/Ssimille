import axios from 'axios';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';

const SearchMusic = ({navigation}) => {
  const handleMusic = text => {
    setSearchName(text);
  };
  const [searchName, setSearchName] = useState();
  const [data, setData] = useState();

  const searchMusic = async () => {
    const apiKey = '8d9fa3281b6b3aad9ce7665f929b0048';
    await axios
      .get(
        `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${searchName}&api_key=${apiKey}&format=json`,
      )
      .then(res => {
        setData(res.data.results.trackmatches.track);
        // console.log(res.data.results.trackmatches);
      });
  };
  return (
    <Container>
      <SearchContainer>
        <SearchInput
          placeholder="음악을 검색해주세요"
          value={searchName}
          onChangeText={handleMusic}
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
        keyExtractor={(item, index) => index.toString()}
        horizontal={false}
        renderItem={({item}) => (
          <Card>
            <MusicInfoContainer
              onPress={() => {
                console.log(item);
                navigation.navigate({
                  name: 'CommunityUpload',
                  params: {name: item.name, artist: item.artist},
                  merge: true,
                });
              }}>
              <CoverImg source={{uri: item.image[0]['#text']}} />
              <MusicInfo>
                <MusicName>{item.name}</MusicName>
                <ArtistName>{item.artist}</ArtistName>
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
