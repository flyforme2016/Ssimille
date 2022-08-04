import React, {useState} from 'react';
import styled from 'styled-components/native';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {useSelector, useDispatch} from 'react-redux';
import actions from '../../actions/index';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dimensions} from 'react-native';
import {getArtistUri} from '../../functions/getArtistUri';
import {postProfileImgToS3, updateProfile} from '../../api/Profile';
const {width} = Dimensions.get('window');

const ProfileEdit = ({navigation, route}) => {
  const reduxDispatch = useDispatch();
  const routeDatas = route.params;
  const {kakaoUid} = useSelector(state => state.kakaoUid);
  const {myProfileData} = useSelector(state => state.myProfile);
  const [idx, setIdx] = useState(route.params.hashTag);
  const [changeName, setChangeName] = useState();
  const [profileImg, setProfileImg] = useState();
  const [visible, setVisible] = useState(route.params.albumTitle);
  const {myGenres} = useSelector(state => state.myGenres);
  let artistUri;

  if (route.params.artistUri) {
    artistUri = getArtistUri(route.params.artistUri);
  } else {
    artistUri = route.params.artist_uri;
  }

  //프로필 사진 변경 함수(=사진가져오기)
  const getProfileImage = async () => {
    try {
      const response = await MultipleImagePicker.openPicker({
        selectedAssets: profileImg,
        mediaType: 'image',
        singleSelectedMode: true,
        isExportThumbnail: true,
        isCrop: true,
        isCropCircle: true,
      });
      setProfileImg(response);
    } catch (e) {
      console.log('error: ', e.message);
    }
  };
  //submit하면 서버에 전송하는 함수(=프로필변경하기)
  const handleProfileEdit = async () => {
    try {
      let result;
      if (profileImg?.path) {
        result = await postProfileImgToS3(profileImg);
      }

      await updateProfile(
        kakaoUid,
        changeName,
        routeDatas,
        result,
        myProfileData,
        idx,
        visible,
        artistUri,
      ).then(res => {
        reduxDispatch(actions.saveUserProfileAction(res.data));
      });
      navigation.navigate('TabBar', {screen: 'Profile'});
    } catch (e) {
      console.log(e, e.message);
    }
  };

  return (
    <>
      <NavBar>
        <NavText>프로필 편집</NavText>
        <SubmitBtn onPress={handleProfileEdit}>
          <BtnText>완료</BtnText>
        </SubmitBtn>
      </NavBar>
      <Container>
        <ImgChangeBtn onPress={getProfileImage}>
          <ImgBackground
            imageStyle={{borderRadius: 100}}
            source={{
              uri: profileImg
                ? 'file://' + (profileImg?.crop?.cropPath ?? profileImg.path)
                : route.params.profileImg,
            }}>
            <Ionicons name="camera-outline" size={35} />
          </ImgBackground>
        </ImgChangeBtn>

        <SelectContainer>
          <NameInput
            placeholder={route.params.nickname}
            value={changeName}
            text-center={true}
            onChangeText={text => {
              setChangeName(text);
            }}
          />
          <ControlBtn>
            <Ionicons name="pencil-outline" size={15} />
          </ControlBtn>
        </SelectContainer>

        {visible && route.params.albumTitle ? (
          <SelectContainer>
            <SelectedWrapper>
              <SelectedImg source={{uri: route.params.albumImg}} />
              <SelectedMusic>
                {route.params.albumTitle} - {route.params.albumArtistName}
              </SelectedMusic>
            </SelectedWrapper>

            <ProfileMusicBtn
              onPress={async () => {
                navigation.navigate('Stack', {
                  screen: 'SearchMusic',
                  params: {
                    page: 'ProfileEdit',
                  },
                });
              }}>
              <BtnText>변경하기</BtnText>
            </ProfileMusicBtn>
            <ProfileMusicBtn
              onPress={() => {
                setVisible(false);
                myProfileData.profile_music_uri = null;
                myProfileData.album_artist_name = null;
                myProfileData.album_title;
                myProfileData.album_image;
                route.params.musicUri = null;
                route.params.albumArtistName = null;
                route.params.albumTitle = null;
                route.params.albumImg = null;
                artistUri = null;
              }}>
              <BtnText>초기화</BtnText>
            </ProfileMusicBtn>
          </SelectContainer>
        ) : (
          <SelectContainer>
            <SelectedMusic>프로필 뮤직을 설정해주세요</SelectedMusic>
            <ProfileMusicBtn
              onPress={async () => {
                setVisible(true);
                navigation.navigate('Stack', {
                  screen: 'SearchMusic',
                  params: {
                    page: 'ProfileEdit',
                  },
                });
              }}>
              <BtnText>설정하기</BtnText>
            </ProfileMusicBtn>
          </SelectContainer>
        )}

        <InfoText>HashTag 설정</InfoText>
        <HashTagContainer width={width}>
          {Object.keys(myGenres)
            .filter(a => a !== ('matrix_seq', 'kakao_user_number'))
            .map(tags => {
              return (
                <HashTagBtn
                  isSelected={idx.includes(tags)}
                  onPress={() => {
                    setIdx(([...prev]) => {
                      if (idx.includes(tags)) {
                        prev.splice(prev.indexOf(tags), 1);
                      } else if (idx.length > 4) {
                        alert('다섯개만 선택하세요');
                      } else {
                        prev.push(tags);
                      }
                      return prev;
                    });
                  }}>
                  <SelectedTags isSelected={idx.includes(tags)}>
                    {tags}
                  </SelectedTags>
                </HashTagBtn>
              );
            })}
        </HashTagContainer>
      </Container>
    </>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: white;
  align-items: center;
  justify-content: center;
`;
const NavBar = styled.View`
  padding: 8px 16px;
  background-color: white;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const NavText = styled.Text`
  color: black;
  font-size: 14px;
  padding: 8px;
`;

const ImgChangeBtn = styled.TouchableOpacity`
  margin: 20px;
`;

const ImgBackground = styled.ImageBackground`
  width: 100;
  height: 100;
  border-radius: 100;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
`;
const ControlBtn = styled.TouchableOpacity`
  justify-content: center;
  margin-right: 5px;
`;

const InfoText = styled.Text`
  color: black;
  margin: 6px 0;
  font-size: 14px;
`;
const BtnText = styled.Text`
  font-size: 12px;
  color: white;
`;

const NameInput = styled.TextInput`
  width: 90%
  text-align: center;
`;

const SelectContainer = styled.View`
  width: 90%;
  border: 1px solid gray;
  border-radius: 10px;
  margin: 4px 0;
  padding: 4px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: row;
`;

const SelectedWrapper = styled.View`
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-right: 10px;
  padding: 8px;
`;
const SelectedMusic = styled.Text`
  font-size: 12px;
  color: black;
`;

const SelectedImg = styled.Image`
  margin-right: 10px;
  width: 35px;
  height: 35px;
`;
const HashTagBtn = styled.TouchableOpacity`
  margin: 3px;
  padding: 6px;
  align-items: center;
  justify-content: center;
  border: ${props => (props.isSelected ? '#dddddd' : '#b7b4df')}
  border-radius: 20;
  background-color: ${props => (props.isSelected ? '#b7b4df' : 'white')};
`;
const ProfileMusicBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 8px;
  background-color: #b7b4df;
  border-radius: 10px;
  margin-right: 5px;
`;
const HashTagContainer = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    padding: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))``;

const SelectedTags = styled.Text`
  font-weight: bold;
  color: ${props => (props.isSelected ? '#ffffff' : 'black')};
`;

const SubmitBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #b7b4df;
  border-radius: 10px;
`;
export default ProfileEdit;
