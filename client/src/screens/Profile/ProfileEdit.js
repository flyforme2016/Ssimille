import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {useSelector, useDispatch} from 'react-redux';
import actions from '../../actions/index';
import axios from 'axios';
import {HashTagIds} from '../../const/datas';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Config from 'react-native-config';
import {DeviceEventEmitter, Dimensions} from 'react-native';
import postProfileImgToS3 from '../../api/postProfileImgToS3.js';
const {width} = Dimensions.get('window');

const ProfileEdit = ({navigation, route}) => {
  const myUid = useSelector(state => state.kakaoUid);
  const reduxDispatch = useDispatch();
  const [idx, setIdx] = useState(route.params.hashTag);
  const [changeName, setChangeName] = useState();
  const routeDatas = route.params;
  const BASE_URL = Config.BASE_URL;
  const [profileImg, setProfileImg] = useState();

  useEffect(() => {
    return () => {
      DeviceEventEmitter.emit('newProfile');
    };
  }, []);

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
        // const formdata = new FormData();
        // const newImageUri = 'file://' + profileImg.path;
        // formdata.append('profileImg', {
        //   uri: newImageUri,
        //   type: profileImg.mime,
        //   name: profileImg.fileName,
        // });
        // console.log('formdata: ', formdata);

        // const result = await (
        //   await fetch(`${BASE_URL}/s3/uploadProfileImg`, {
        //     method: 'POST',
        //     body: formdata,
        //     redirect: 'follow',
        //   })
        // ).json();
      }

      await axios
        .post(`${BASE_URL}/profile/editProfile`, {
          key: myUid.kakaoUid,
          nickname: changeName ? changeName : routeDatas.nickname,
          profileImg: result ? result.imgUrl : routeDatas.profileImg,
          profileMusicUri: routeDatas.musicUri
            ? routeDatas.musicUri
            : routeDatas.profileMusic,
          albumArtistName: routeDatas.albumArtistName
            ? routeDatas.albumArtistName
            : routeDatas.artistName,
          albumTitle: routeDatas.albumTitle
            ? routeDatas.albumTitle
            : routeDatas.albumTitle,
          albumImage: routeDatas.albumImg
            ? routeDatas.albumImg
            : routeDatas.albumImg,
          hashTag: idx ? idx : routeDatas.hashTag,
        })
        .then(
          res => {
            reduxDispatch(actions.saveUserProfileAction(res.data));
          },
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

        {route.params.albumTitle ? (
          <SelectContainer>
            <SelectedWrapper>
              <SelectedImg source={{uri: route.params.albumImg}} />
              <SelectedMusic>
                {route.params.albumTitle} - {route.params.artistName}
              </SelectedMusic>
            </SelectedWrapper>

            <ProfileMusicBtn
              onPress={async () => {
                console.log('clicked');
                navigation.navigate('Stack', {
                  screen: 'SearchMusic',
                  params: {
                    page: 'ProfileEdit',
                  },
                });
              }}>
              <BtnText>변경하기</BtnText>
            </ProfileMusicBtn>
          </SelectContainer>
        ) : (
          <SelectContainer>
            <SelectedMusic>프로필 뮤직을 설정해주세요</SelectedMusic>
            <ProfileMusicBtn
              onPress={async () => {
                console.log('clicked');
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
  margin-top: 6px;
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
  padding-bottom: 8px;
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
`;
const HashTagContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: ${({width}) => width - 40};
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
  padding: 10px;
  background-color: #b7b4df;
  border-radius: 10px;
`;
export default ProfileEdit;
