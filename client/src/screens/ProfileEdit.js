/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import styled from 'styled-components/native';
import CustomButton from '../components/CustomButtons';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';

const SUBMIT = {
  uri: 'https://cdn0.iconfinder.com/data/icons/ui-elements-03/64/Upload-arrow-up-submit-128.png',
  width: 30,
  height: 30,
};
const AVARTA = {
  uri: 'https://cdn4.iconfinder.com/data/icons/outlines-business-web-optimization/256/1-89-128.png',
  width: 70,
  height: 70,
};
const PLUS = {
  uri: 'https://cdn0.iconfinder.com/data/icons/mobile-basic-vol-1/32/Circle_Plus-128.png',
  width: 35,
  height: 35,
};
const COMMENTS = {
  uri: 'https://cdn4.iconfinder.com/data/icons/network-and-communication-2-10/48/78-128.png',
  width: 20,
  height: 20,
};

const ProfileEdit = ({navigation: {navigate}}) => {
  const [ProfileImg, setProfileImg] = useState();

  const [changeName, setChangeName] = useState();
  const [changeIntro, setChangeIntro] = useState();
  //닉네임 & 소개글 변경 함수
  const handleName = event => {
    setChangeName(event.target.value);
  };
  const handleIntro = event => {
    setChangeIntro(event.target.value);
  };
  //프로필 사진 변경 함수
  const getProfileImage = async () => {
    try {
      const response = await MultipleImagePicker.openPicker({
        selectedAssets: ProfileImg,
        mediaType: 'image',
        singleSelectedMode: true,
        isExportThumbnail: true,
        isCrop: true,
        isCropCircle: true,
      });
      console.log('response: ', response);
      await setProfileImg(response);
    } catch (e) {
      console.log(e.code, e.message);
    }
  };
  //submit하면 서버에 전송하는 함수
  const handleProfileEdit = async event => {
    event.preventDefault();
    try {
      const formdata = new FormData();

      await ProfileImg.map(image => {
        formdata.append('multipleImg', {
          uri: image.path,
          type: image.mime,
          name: image.fileName,
        });
      });

      console.log('formdata: ', formdata);

      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
        // headers :{'Content-Type': 'multipart/form-data'}
      };

      await fetch(
        'http://192.168.0.106:3000/s3/uploadMultipleImg',
        requestOptions,
      )
        .then(response => response.text())
        .then(result => console.log(result))
        .then(navigate('TabBar', {screen: 'Profile'}));
    } catch (e) {
      console.log(e.code, e.message);
    }
  };
  return (
    <Container>
      <NavBar>
        <NavText>PROFILE EDIT</NavText>
      </NavBar>
      <ImgPreview source={ProfileImg ? ProfileImg : AVARTA} />
      <CustomButton text="사진 가져오기" onPress={getProfileImage} />
      <CustomButton text="프로필뮤직변경" />
      <EditInput
        placeholder="이명희"
        value={changeName}
        onChangeText={handleName}
      />
      <EditInput
        placeholder="안녕하세요 인천에 살고있는 26살 이명희 입니다!"
        value={changeIntro}
        onChangeText={handleIntro}
        line={5}
      />
      <CustomButton onPress={handleProfileEdit} text="프로필 변경" />
    </Container>
  );
};
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin: 10px;
  padding: 10px;
`;

const NavBar = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const NavText = styled.Text`
  color: #9b59b6;
  font-size: 24;
  padding: 8px;
`;
const ImgPreview = styled.Image`
  width: 100;
  height: 100;
`;

const EditInput = styled.TextInput`
  margin: 10px;
  border: 2px solid gray;
  border-radius: 10px;
  background-color: white;
  width: 200;
`;

export default ProfileEdit;
