import React, {useLayoutEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import SpotifyTab from '../../components/SpotifyTab';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import {useQuery} from 'react-query';
import getRef from '../../functions/getRef';
import {query, onSnapshot, where} from 'firebase/firestore';
import TopNavBar from '../../components/TopNavBar';
import {remote} from 'react-native-spotify-remote';
import {checkIsFriend} from '../../api/Friend';
import checkEvent from '../../functions/checkEvent';
import Modal from 'react-native-modal';
import {useIsFocused} from '@react-navigation/native';

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
  const [modalData, setModalData] = useState([{}]);
  const [modalVisible, setModalVisible] = useState(false);
  const [alarmStack, setAlarmStack] = useState(0);
  const [locationPlaylist, setLocationPlaylist] = useState([]);
  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    getAlarmStack();
    getLocationPlaylist();
  }, []);

  useLayoutEffect(() => {
    if (isFocused) {
      if (modalData.length > 1 && !modalVisible) {
        //아직 이벤트 유저가 남은 경우
        setModalData(prev =>
          prev.filter(data => {
            return data.uid !== prev[prev.length - 1].uid;
          }),
        );
        setModalVisible(true);
      }
    }
  }, [isFocused]);

  const getAlarmStack = async () => {
    const stackAlarmDocRef = getRef.alarmStackDocRef(String(kakaoUid));
    onSnapshot(stackAlarmDocRef, doc => {
      if (doc.exists()) setAlarmStack(doc.data().stack);
      else setAlarmStack(0);
    });
  };

  const getLocationPlaylist = async () => {
    const currentMusicListRef = getRef.currentMusicColRef(locationName.code);
    const q = query(currentMusicListRef);
    const subscribe = onSnapshot(q, async querySnapshot => {
      const result = await checkEvent(
        currentMusicListRef,
        querySnapshot,
        myProfileData,
      );
      if (result.length) {
        setModalData(result);
        setModalVisible(true);
      }

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
      //Cannot read properties of null error 발생 지점
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
            <Text>{locationName ? locationName.address_name : '설정하기'}</Text>
          </Btn>
        </MyzoneContainer>

        {locationPlaylist && (
          <>
            <RecommendText>주변 사용자가 듣고있는 음악</RecommendText>
            <RecommendPlaylist
              nestedScrollEnabled={true}
              horizontal={true}
              data={locationPlaylist}
              keyExtractor={item => item.uid + ''}
              renderItem={({item}) =>
                item.uid === kakaoUid / 1 ? null : (
                  <>
                    <AlbumRecommendContainer>
                      <ImgBackground
                        resizeMode="stretch"
                        source={{
                          uri: item.albumImg,
                        }}>
                        <ProfileContainer
                          onPress={async () => {
                            const flag = await checkIsFriend(
                              kakaoUid,
                              item.uid,
                            );
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
                )
              }
            />
          </>
        )}
        {RecommendMusic && (
          <>
            <RecommendText>
              {myProfileData.nickname}님을 위한 음악 추천
            </RecommendText>
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
        {/* {RecommendMusic && (
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
        )} */}
        <Modal
          onBackButtonPress={() => setModalVisible(false)}
          //isVisible Props에 State 값을 물려주어 On/off control
          isVisible={modalVisible}
          //아이폰에서 모달창 동작시 깜박임이 있었는데, useNativeDriver Props를 True로 주니 해결되었다.
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ModalWrapper>
            <ModalText>
              {myProfileData.nickname}님과 같은 노래를 듣고 있는 유저가 있어요!
            </ModalText>
            <ModalContentsWrapper>
              <OtherInfoWrapper>
                <AvatarWrapper>
                  <Avatar
                    source={{uri: modalData[modalData.length - 1].profileImg}}
                  />
                </AvatarWrapper>
                <ModalText>
                  {modalData[modalData.length - 1].nickname}
                </ModalText>
              </OtherInfoWrapper>
              <ModalButtonWrapper>
                <ModalButton
                  onPress={async () => {
                    setModalVisible(false);
                    const flag = await checkIsFriend(
                      kakaoUid,
                      modalData[modalData.length - 1].uid,
                    );
                    console.log('flag: ', flag);
                    push('Stack', {
                      screen: 'OtherUserProfile',
                      params: {
                        otherUid: modalData[modalData.length - 1].uid,
                        isFriend: flag,
                      },
                    });
                  }}>
                  <ModalText>이동</ModalText>
                </ModalButton>
                <ModalButton
                  onPress={() => {
                    if (modalData.length > 1) {
                      //아직 이벤트 유저가 남은 경우
                      setModalData(prev =>
                        prev.filter(data => {
                          return data.uid !== prev[prev.length - 1].uid;
                        }),
                      );
                    } else {
                      setModalVisible(false);
                    }
                  }}>
                  <ModalText>무시</ModalText>
                </ModalButton>
              </ModalButtonWrapper>
            </ModalContentsWrapper>
          </ModalWrapper>
        </Modal>
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
  /* font-family: 'Jua-Regular'; */
`;

const RecommendPlaylist = styled.FlatList``;

const RecommendText = styled.Text`
  margin: 5px;
  font-size: 16px;
  /* font-family: 'Jua-Regular'; */
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

const ModalWrapper = styled.View`
  flex-direction: column;
  width: 90%;
  height: 100px;
  padding: 5px;
  border: 1px white;
  border-radius: 10px;
`;

const ModalContentsWrapper = styled.View`
  flex: 1;
  flex-direction: row;
`;

const OtherInfoWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const AvatarWrapper = styled.View`
  margin-right: 5px;
`;

const Avatar = styled.Image`
  width: 40;
  height: 40;
  border-radius: 25px;
`;

const ModalButtonWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const ModalButton = styled.TouchableOpacity`
  /* Modal Button들의 모달창 내의 높이를 균일하게 하기 위하여 flex를 줌 */
  width: 50px;
  height: 30px;
  justify-content: center;
  align-items: center;
  border: 1px white;
  border-radius: 10px;
  background-color: #b7b4df;
`;

const ModalText = styled.Text`
  color: white;
  font-size: 15px;
`;

export default Home;
