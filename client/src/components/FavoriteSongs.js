import React from 'react';
import styled from 'styled-components/native';
import {remote} from 'react-native-spotify-remote';
import {useSelector} from 'react-redux';
import axios from 'axios';
import Config from 'react-native-config';
import {useQuery} from 'react-query';
import TopNavBar from './TopNavBar';

const FavoriteSongs = ({navigation, route}) => {
  const BASE_URL = Config.BASE_URL;
  const {kakaoUid} = useSelector(state => state.kakaoUid);
  const {data: favSongDatas} = useQuery('favSongDatas', async () => {
    const {data} = await axios(`${BASE_URL}/users/favorite-songs`, {
      params: {
        key: route.params.userId,
      },
    });
    return data;
  });

  return (
    <Container>
      {route.params.userId + '' === kakaoUid ? (
        <TopNavBar
          navText="애청곡"
          iconName="settings-outline"
          onPress={() =>
            navigation.push('Stack', {
              screen: 'EditFavoriteSongs',
            })
          }
        />
      ) : (
        <TopNavBar navText="애청곡" />
      )}

      {favSongDatas?.length === 0 ? (
        <MusicInfoContainer>
          <MusicName>등록된 음악이 없습니다.</MusicName>
        </MusicInfoContainer>
      ) : (
        <MusicResultList
          data={favSongDatas}
          keyExtractor={item => item.id + ''}
          horizontal={false}
          renderItem={({item}) => (
            <Card
              onPress={() => {
                remote.playUri(item.music_uri);
              }}>
              <MusicInfoContainer>
                <MusicWrapper>
                  <CoverImg source={{uri: item.album_image}} />
                  <MusicInfo>
                    <MusicName>{item.album_title}</MusicName>
                    <ArtistName>{item.album_artist_name}</ArtistName>
                  </MusicInfo>
                </MusicWrapper>
              </MusicInfoContainer>
            </Card>
          )}
        />
      )}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const MusicResultList = styled.FlatList``;

const Card = styled.TouchableOpacity`
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
  margin: 5px 10px;
  border-radius: 10px;
  elevation: 3;
`;

const MusicInfoContainer = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px;
`;

const MusicWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const CoverImg = styled.Image`
  width: 30px;
  height: 30px;
`;
const MusicInfo = styled.View`
  flex-direction: column;
  justify-content: center;
  margin: 7px;
`;

const MusicName = styled.Text`
  font-size: 14px;
  font-weight: bold;
`;

const ArtistName = styled.Text`
  font-size: 12px;
`;

export default FavoriteSongs;
