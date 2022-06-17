import React, {useState} from 'react';
import styled from 'styled-components/native';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {useSelector, useDispatch} from 'react-redux';
import actions from '../../actions/index';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';
import {HashTagIds} from '../../datas';
import getSpotifyToken from '../../api/getSpotifyToken';

const ProfileEdit = ({navigation, route}) => {
  const myUid = useSelector(state => state.kakaoUid);
  const reduxDispatch = useDispatch();
  const {profileImg} = useSelector(state => state.uploadProfileImg);
  const [idx, setIdx] = useState(route.params.hashTag);
  const [changeName, setChangeName] = useState();
  console.log(idx);

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
          'http://192.168.0.124:3000/s3/uploadProfileImg',
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
        .post('http://192.168.0.124:3000/profile/editProfile', {
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
      <Container>
        <NavBar>
          <NavText>PROFILE EDIT</NavText>
        </NavBar>
        <ImgChangeBtn onPress={getProfileImage}>
          <ImgPreview
            source={{
              uri: profileImg
                ? 'file://' + (profileImg?.crop?.cropPath ?? profileImg.path)
                : route.params.profileImg,
            }}
          />
        </ImgChangeBtn>
        <InfoText> 닉네임 변경하기 </InfoText>
        <NameInput
          placeholder={route.params.nicknmae}
          value={changeName}
          onChangeText={text => {
            console.log(changeName);
            setChangeName(text);
          }}
        />

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
        {route.params ? (
          <SelectContainer>
            <SelectedImg source={{uri: route.params.albumImg}} />
            <SelectedMusic>
              {route.params.albumTitle} {route.params.albumArtistName}
            </SelectedMusic>
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
                <SelectedTags>{data.name}</SelectedTags>
              </HashTagBtn>
            );
          })}
        </HashTagContainer>
        <SubmitBtn onPress={handleProfileEdit}>
          <BtnText>프로필 변경</BtnText>
        </SubmitBtn>
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
const NavBar = styled.View``;
const NavText = styled.Text`
  color: #9b59b6;
  font-size: 24px;
  padding: 8px;
`;
const ImgPreview = styled.Image`
  margin: 10px;
  width: 80;
  height: 80;
  border-radius: 100;
`;
const ImgChangeBtn = styled.TouchableOpacity`
  width: 100;
`;
const InfoText = styled.Text`
  margin-top: 6px;
  font-size: 14px;
`;
const BtnText = styled.Text`
  font-size: 14px;
  color: white;
`;
const NameInput = styled.TextInput`
  margin-top: 10px;
  border: 1px solid gray;
  border-radius: 10px;
  width: 200;
`;

const SelectContainer = styled.View`
  align-items: center;
  flex-direction: row;
`;
const SelectedMusic = styled.Text`
  font-size: 12px;
`;

const SelectedImg = styled.Image`
  margin: 0 10px;
  width: 40px;
  height: 40px;
`;
const HashTagBtn = styled.Pressable`
  margin: 2px;
  padding: 6px;
  align-items: center;
  justify-content: center;
  border-radius: 10;
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
`;

const SubmitBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  padding: 12px;
  background-color: #b7b4df;
  border-radius: 10px;
`;
export default ProfileEdit;
