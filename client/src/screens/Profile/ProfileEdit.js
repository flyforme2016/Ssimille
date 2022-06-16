import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import styled from 'styled-components/native';
import CustomButton from '../../components/CustomButtons';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {useSelector, useDispatch} from 'react-redux';
import actions from '../../actions/index';
import itemIds from '../../items';
import postProfileImg from '../../api/postProfileImg';
import RNFetchBlob from 'rn-fetch-blob';

const AVARTA =
  'https://cdn4.iconfinder.com/data/icons/outlines-business-web-optimization/256/1-89-128.png';
const SUBMIT = {
  uri: 'https://cdn3.iconfinder.com/data/icons/miscellaneous-227-solid/128/apply_registration_online_application_register_submit_subscription-128.png',
  width: 30,
  height: 30,
};

const ProfileEdit = ({navigation: {navigate}}) => {
  const {profileImg} = useSelector(state => state.uploadProfileImg); //profileImg
  const reduxDispatch = useDispatch();
  const [idx, setIdx] = React.useState([]); //hasgTag
  const [changeName, setChangeName] = useState(); //nickname
  //닉네임 변경 함수
  const handleName = e => {
    setChangeName(e.nativeEvent.text);
  };
  //프로필 사진 변경 함수
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
  //submit하면 서버에 전송하는 함수
  const handleProfileEdit = async event => {
    event.preventDefault();
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
        ).then(console.log('성공'))
      ).json();

      console.log('result: ', result);
      postProfileImg(result.imgUrl);
    } catch (e) {
      console.log(e, e.message);
    }
    navigate('TabBar', {screen: 'Profile'});
  };
  console.log(idx);
  return (
    <Container>
      <NavBar>
        <NavText>PROFILE EDIT</NavText>
      </NavBar>
      <Setting onPress={() => navigate('TabBar', {screen: 'Profile'})}>
        <Logo onPress={handleProfileEdit} source={SUBMIT} />
      </Setting>
      <ImgPreview
        source={{
          uri: profileImg
            ? 'file://' + (profileImg?.crop?.cropPath ?? profileImg.path)
            : AVARTA,
        }}
      />
      <CustomButton text="사진 가져오기" onPress={getProfileImage} />
      <EditInput
        placeholder="닉네임"
        value={changeName}
        onChange={handleName}
      />

      <CustomButton text="프로필 뮤직 변경" />

      <CustomButton onPress={handleProfileEdit} text="프로필 변경" />

      <NavText>HashTag 설정</NavText>
      <Container2>
        {itemIds.map(data => {
          const isSelected = idx.includes(data);
          return (
            <Pressable
              onPress={() => {
                setIdx(([...prev]) => {
                  const id = prev.indexOf(data);
                  if (id > -1) prev.splice(id, 1);
                  else if (idx.length > 4) alert('다섯개만 선택하세여');
                  else prev.push(data);
                  return prev;
                });
              }}
              style={{
                backgroundColor: isSelected ? '#b7b4df' : '#f2f2f2',
                width: 50,
                height: 40,
                alignItems: 'center',
                borderRadius: 100,
              }}>
              <Text style={{fontWeight: 'bold', color: 'black'}}>
                {data.name}
              </Text>
            </Pressable>
          );
        })}
      </Container2>
    </Container>
  );
};

// const Container = styled.View`
//   flex: 1;
//   justify-content: center;
//   align-items: center;
//   margin: 10px;
//   padding: 10px;
// `;
const Container2 = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 0px;
  padding: 10px;
`;
const Container = styled.ScrollView.attrs(() => ({
  margin: 10,
  padding: 10,
  contentContainerStyle: {
    alignItems: 'center',
    justifycontent: 'center',
  },
}))``;

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
  border-radius: 100;
`;

const EditInput = styled.TextInput`
  margin: 10px;
  border: 2px solid gray;
  border-radius: 10px;
  background-color: white;
  width: 200;
`;
const Setting = styled.TouchableOpacity`
  width: 100;
  position: relative;
  bottom: 50px;
  left: 130px;
`;
const Logo = styled.Image`
  width: 40;
  height: 40;
  position: relative;
  left: 70px;
  
    '' /* position: relative;
  top: -180px;
  left: 60px; */
  
`;

export default ProfileEdit;
