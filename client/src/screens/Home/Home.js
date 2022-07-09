import React, {useLayoutEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import logo from '../../logo.png';
import SpotifyTab from '../../components/SpotifyTab';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import {useQuery} from 'react-query';
import getRef from '../../functions/getRef';
import {query, onSnapshot, where} from 'firebase/firestore';
import TopNavBar from '../../components/TopNavBar';
import {remote} from 'react-native-spotify-remote';
import checkIsFriend from '../../api/checkIsFriend';

const SPOTIFY_CLIENT_ID = Config.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = Config.SPOTIFY_CLIENT_SECRET;
const BASE_URL = Config.BASE_URL;

const SpotifyWebApi = require('spotify-web-api-node');
const spotifyWebApi = new SpotifyWebApi({
  clientID: `${SPOTIFY_CLIENT_ID}`,
  clientSecret: `${SPOTIFY_CLIENT_SECRET}`,
  redirectURL: `${BASE_URL}/spotify/oauth/callback`,
});

const Home = ({navigation: {navigate, push}}) => {
  const {myProfileData} = useSelector(state => state.myProfile);
  const {kakaoUid} = useSelector(state => state.kakaoUid);
  const {locationName} = useSelector(state => state.locationName);
  const {spotifyToken} = useSelector(state => state.spotifyToken);
  const [alarmStack, setAlarmStack] = useState(0);
  const [locationPlaylist, setLocationPlaylist] = useState([]);

  useLayoutEffect(() => {
    getLocationPlaylist();
    getAlarmStack();
  }, []);

  const getAlarmStack = async () => {
    const stackAlarmDocRef = getRef.alarmStackDocRef(kakaoUid);
    onSnapshot(stackAlarmDocRef, doc => {
      if (doc.exists()) {
        setAlarmStack(doc.data().stack);
      }
    });
  };

  const getLocationPlaylist = async () => {
    const currentMusicListRef = getRef.currentMusicColRef(locationName.code); //my alarmList
    const q = query(
      currentMusicListRef,
      where('uid', 'not-in', [kakaoUid / 1]),
    );
    const subscribe = onSnapshot(q, querySnapshot => {
      setLocationPlaylist(
        querySnapshot.docs.map(doc => ({
          uid: doc.data().uid,
          nickname: doc.data().nickname,
          profileImg: doc.data().profileImg,
          musicUri: doc.data().musicUri,
          albumTitle: doc.data().albumTitle,
          albumArtistName: doc.data().albumArtistName,
          albumImg: doc.data().albumImg,
        })),
      );
      return subscribe;
    });
  };
  const {isLoading, data: RecommendMusic} = useQuery(
    ['RecommendMusic'],
    async () => {
      await spotifyWebApi.setAccessToken(spotifyToken);
      const {body} = await spotifyWebApi.getRecommendations({
        min_energy: 0.4,
        seed_artists: [myProfileData.artist_uri],
        min_popularity: 50,
      });
      return body;
    },
  );

  return isLoading ? (
    <Loader>
      <ActivityIndicator />
    </Loader>
  ) : (
    <>
      <Container>
        <TopNavBar
          navText="홈"
          iconName="notifications-outline"
          onPress={() => push('Stack', {screen: 'Notice'})}
        />
        {alarmStack !== 0 ? (
          <AlarmStackWrapper>
            <AlarmStack>{alarmStack ? alarmStack : null}</AlarmStack>
          </AlarmStackWrapper>
        ) : null}
        <MyzoneContainer>
          <Btn onPress={() => push('Stack', {screen: 'Myzone'})}>
            <Text>MY ZONE </Text>
            <Text> {locationName ? locationName.address_name : null}</Text>
          </Btn>
        </MyzoneContainer>

        {locationPlaylist && (
          <>
            <RecommendText>음악 추천</RecommendText>
            <RecommendPlaylist
              nestedScrollEnabled={true}
              horizontal={true}
              data={locationPlaylist}
              keyExtractor={item => item.uid + ''}
              renderItem={({item}) => (
                <>
                  <AlbumRecommendContainer>
                    <ImgBackground
                      resizeMode="stretch"
                      source={{
                        uri: item.albumImg,
                      }}>
                      <ProfileContainer
                        onPress={async () => {
                          const flag = await checkIsFriend(kakaoUid, item.uid);
                          navigate('Stack', {
                            screen: 'OtherUserProfile',
                            params: {
                              otherUid: item.uid,
                              isFriend: flag,
                            },
                          });
                        }}>
                        <ProfileImg source={{uri: item.profileImg}} />
                        {/* <InfoText>{item.nickname}</InfoText> */}
                      </ProfileContainer>
                      <AlbumContainer
                        onPress={async () => {
                          await remote.playUri(item.musicUri);
                        }}>
                        <InfoText>{item.albumTitle}</InfoText>
                        <InfoText>{item.albumArtistName}</InfoText>
                      </AlbumContainer>
                    </ImgBackground>
                  </AlbumRecommendContainer>
                </>
              )}
            />
          </>
        )}
        {RecommendMusic && (
          <>
            <RecommendText>음악 추천</RecommendText>
            <RecommendPlaylist
              nestedScrollEnabled={true}
              horizontal={true}
              data={RecommendMusic.tracks}
              keyExtractor={item => item.id + ''}
              renderItem={({item}) => (
                <>
                  <AlbumRecommendContainer>
                    <ImgBackground
                      resizeMode="stretch"
                      source={{
                        uri: item.album.images[0].url,
                      }}>
                      <AlbumContainer
                        onPress={async () => {
                          console.log('clicked', item.uri);
                          await remote.playUri(item.uri);
                        }}>
                        <InfoText>{item.album.name}</InfoText>
                        <InfoText>{item.artists[0].name}</InfoText>
                      </AlbumContainer>
                    </ImgBackground>
                  </AlbumRecommendContainer>
                </>
              )}
            />
          </>
        )}
        {RecommendMusic && (
          <>
            <RecommendText>친구 추천</RecommendText>
            <RecommendPlaylist
              nestedScrollEnabled={true}
              horizontal={true}
              data={RecommendMusic.tracks}
              keyExtractor={item => item.id + ''}
              renderItem={({item}) => (
                <>
                  <Card>
                    <UserInfo>
                      <UserImg>
                        <Avatar source={{uri: item.album.images[0].url}} />
                      </UserImg>
                      <InfoBox>
                        <UserName>{item.album.name}</UserName>
                      </InfoBox>
                    </UserInfo>
                    <MusicPlay>
                      <UserMusic>{item.artists[0].name}</UserMusic>
                    </MusicPlay>
                  </Card>
                </>
              )}
            />
          </>
        )}
      </Container>
      <SpotifyTab />
    </>
  );
};

///
const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Container = styled.ScrollView`
  flex: 1;
  height: 100%;
  background-color: white;
`;

const AlarmStackWrapper = styled.View`
  position: absolute;
  width: 14px;
  height: 14px;
  right: 10px;
  top: 5px;
  align-items: center;
  justify-content: center;
  border-radius: 7;
  background-color: #b7b4df;
`;

const AlarmStack = styled.Text`
  font-size: 8px;
  color: white;
  text-align: center;
`;
const MyzoneContainer = styled.View``;
const Btn = styled.TouchableOpacity`
  padding: 10px;
  background-color: white;
  align-items: center;
  justify-content: center;
  border: 1px solid grey;
`;
const Text = styled.Text`
  font-size: 12px;
  font-family: 'Jua-Regular';
`;

const RecommendPlaylist = styled.FlatList``;

const RecommendText = styled.Text`
  margin: 5px;
  font-size: 16px;
  font-family: 'Jua-Regular';
`;
const ProfileImg = styled.Image`
  width: 30;
  height: 30;
  border-radius: 20px;
`;

const ImgBackground = styled.ImageBackground`
  width: 130;
  height: 130;
`;
const ProfileContainer = styled.TouchableOpacity`
  margin: 5px;
  align-items: center;
  flex-direction: row;
`;

const AlbumRecommendContainer = styled.View`
  width: 130;
  height: 130;
  margin: 0 8px;
`;
const AlbumContainer = styled.TouchableOpacity`
  position: absolute;
  left: 5px;
  bottom: 5px;
`;

const InfoText = styled.Text`
  color: #ffffff;
  font-size: 10px;
  font-weight: bold;
  /* background-color: black; */
`;
const Card = styled.TouchableOpacity`
  width: 130;
  height: 150;
  padding: 15px 10px;
  border-radius: 20px;
  background-color: #ffffff;
  border: 1px solid #b7b4df;
  align-items: center;
  justify-content: space-between;
  margin: 8px 8px;
  elevation: 3;
`;

const UserInfo = styled.View`
  align-items: center;
`;
const MusicPlay = styled.TouchableOpacity``;

const UserImg = styled.View`
  margin-right: 5px;
  padding: 5px;
`;

const Avatar = styled.Image`
  width: 55;
  height: 55;
  border-radius: 25px;
`;
const InfoBox = styled.View`
  margin: 5px;
`;
const UserName = styled.Text`
  margin-bottom: 3px;
  font-size: 10px;
  color: black;
`;
const UserMusic = styled.Text`
  font-size: 10px;
  color: black;
`;

export default Home;
