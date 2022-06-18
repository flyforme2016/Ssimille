import React, {useState} from 'react';
import styled from 'styled-components/native';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {useSelector, useDispatch} from 'react-redux';
import actions from '../../actions/index';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';
import {HashTagIds} from '../../datas';
import getSpotifyToken from '../../api/getSpotifyToken';
import Config from 'react-native-config';

const ProfileEdit = ({navigation, route}) => {
  const myUid = useSelector(state => state.kakaoUid);
  const reduxDispatch = useDispatch();
  const {profileImg} = useSelector(state => state.uploadProfileImg);
  const [idx, setIdx] = useState(route.params.hashTag);
  const [changeName, setChangeName] = useState();
  const BASE_URL = Config.BASE_URL;

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
      console.log('response: ', response);
      reduxDispatch(actions.uploadProfileImgAction(response));
    } catch (e) {
      console.log('error: ', e.message);
    }
  };
  //submit하면 서버에 전송하는 함수(=프로필변경하기)
  const handleProfileEdit = async () => {
    try {
      const formdata = new FormData();
      const newImageUri = 'file://' + profileImg.path;
      formdata.append('profileImg', {
        uri: newImageUri,
        type: profileImg.mime,
        name: profileImg.fileName,
      });
      console.log('formdata: ', formdata);

      const result = await (
        await RNFetchBlob.fetch(
          'POST',
          `${BASE_URL}/s3/uploadProfileImg`,
          {
            'Content-Type': 'multipart/form-data',
          },
          [
            {
              name: 'profileImg',
              filename: profileImg.fileName,
              data: RNFetchBlob.wrap(profileImg.path),
            },
          ],
        ).then(console.log('result: ', result))
      ).json();

      await axios
        .post(`${BASE_URL}/profile/editProfile`, {
          key: myUid.kakaoUid,
          nickname: changeName,
          profileImg: result.imgUrl,
          profileMusicUri: route.params.musicUri,
          albumArtistName: route.params.albumArtistName,
          albumTitle: route.params.albumTitle,
          albumImage: route.params.albumImg,
          hashTag: idx,
        })
        .then(
          res => console.log(res, '업로드 완료'),
          err => {
            console.log('서버 전송실패', err);
          },
        );
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
          <ImgPreview
            source={{
              uri: profileImg
                ? 'file://' + (profileImg?.crop?.cropPath ?? profileImg.path)
                : route.params.profileImg,
            }}
          />
        </ImgChangeBtn>
        <NameInput
          placeholder={route.params.nicknmae}
          value={changeName}
          text-center={true}
          onChangeText={text => {
            console.log(changeName);
            setChangeName(text);
          }}
        />

        {route.params ? (
          <SelectContainer>
            <SelectedImg source={{uri: route.params.albumImg}} />
            <SelectedMusic>
              {route.params.albumTitle} - {route.params.artistName}
            </SelectedMusic>
            <ProfileMusicBtn
              onPress={async () => {
                console.log('clicked');
                await getSpotifyToken();
                navigation.navigate('Stack', {
                  screen: 'SearchMusic',
                  params: {
                    page: 'ProfileEdit',
                  },
                });
              }}>
              <BtnText>프로필 음악 변경하기</BtnText>
            </ProfileMusicBtn>
          </SelectContainer>
        ) : null}

        <InfoText>HashTag 설정</InfoText>

        <HashTagContainer>
          {HashTagIds.map(data => {
            return (
              <HashTagBtn
                isSelected={idx.includes(data.name)}
                onPress={() => {
                  setIdx(([...prev]) => {
                    if (idx.includes(data.name)) {
                      prev.splice(prev.indexOf(data.name), 1);
                    } else if (idx.length > 4) {
                      alert('다섯개만 선택하세요');
                    } else {
                      prev.push(data.name);
                    }
                    return prev;
                  });
                }}>
                <SelectedTags isSelected={idx.includes(data.name)}>
                  {data.name}
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
  padding: 10px;
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
const ImgPreview = styled.Image`
  margin: 10px;
  width: 100;
  height: 100;
  border-radius: 100;
  border: 1px solid gray;
`;
const ImgChangeBtn = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 100;
`;
const InfoText = styled.Text`
  color: black;
  margin-top: 6px;
  font-size: 14px;
`;
const BtnText = styled.Text`
  font-size: 14px;
  color: white;
`;
const NameInput = styled.TextInput`
  width: 90%
  margin-top: 10px;
  border: 1px solid gray;
  border-radius: 10px;
  text-align: center;
`;

const SelectContainer = styled.View`
  width: 90%;
  border: 1px solid gray;
  border-radius: 10px;
  padding: 8px;
  margin-top: 8px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
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
const HashTagBtn = styled.Pressable`
  margin: 3px;
  padding: 6px;
  align-items: center;
  justify-content: center;
  border: ${props => (props.isSelected ? '#dddddd' : '#b7b4df')}
  border-radius: 20;
  background-color: ${props => (props.isSelected ? '#b7b4df' : 'white')};
`;
const ProfileMusicBtn = styled.TouchableOpacity`
  margin: 12px;
  justify-content: center;
  align-items: center;
  padding: 12px;
  background-color: #b7b4df;
  border-radius: 10px;
`;
const HashTagContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 8px;
  padding: 8px;
`;
const SelectedTags = styled.Text`
  font-weight: bold;
  color: ${props => (props.isSelected ? '#ffffff' : 'black')};
`;

const SubmitBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 12px;
  background-color: #b7b4df;
  border-radius: 10px;
`;
export default ProfileEdit;
