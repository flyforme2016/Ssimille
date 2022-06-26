import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import axios from 'axios';
import {useSelector} from 'react-redux';
import Config from 'react-native-config';
import {DeviceEventEmitter} from 'react-native';

const CommunityUpload = ({navigation, route}) => {
  const BASE_URL = Config.BASE_URL;
  const {myProfileData} = useSelector(state => state.myProfile);
  const {locationName} = useSelector(state => state.locationName);

  const [uploadImgs, setUploadImgs] = useState([]);
  const [postContent, setPostContent] = useState();
  let submitImgs = Array(5).fill(null);

  useEffect(() => {
    return () => {
      DeviceEventEmitter.emit('test');
    };
  }, []);
  const handleImgUpload = async () => {
    try {
      const response = await MultipleImagePicker.openPicker({
        selectedAssets: uploadImgs,
        mediaType: 'image',
        isExportThumbnail: true,
        isCrop: true,
        isCropCircle: true,
      });
      setUploadImgs(response);
      console.log('1', response);
    } catch (e) {
      console.log(e.code, e.message);
    }
  };
  //사진 업로드
  const submitPhotos = async () => {
    const formdata = new FormData();
    console.log('2', uploadImgs);
    try {
      await uploadImgs.map(MultipleImg => {
        formdata.append('multipleImg', {
          uri: 'file://' + MultipleImg.path,
          type: MultipleImg.mime,
          name: MultipleImg.fileName,
        });
      });
      const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };
      const result = await (
        await fetch(`${BASE_URL}/s3/uploadMultipleImg`, requestOptions)
      ).json();
      console.log('3', result);

      result.map(data => {
        submitImgs.shift();
        submitImgs.push(data.transforms[0].location);
      });
    } catch {
      err => console.log(err);
    }
    submitImgs.reverse();
    console.log('4', submitImgs);
  };

  //upload post to server process
  const onSubmitPost = async () => {
    await submitPhotos();
    try {
      await axios
        .post(`${BASE_URL}/post/uploadPost`, {
          key: myProfileData.kakao_user_number,
          regionDepth1: locationName.region_1depth_name,
          addressName: locationName.address_name,
          musicUri: route.params ? route.params.musicUri : null,
          albumTitle: route.params ? route.params.albumTitle : null,
          albumImg: route.params ? route.params.albumImg : null,
          albumArtistName: route.params ? route.params.albumArtistName : null,
          inputText: postContent ? postContent : null,
          images: submitImgs,
        })
        .then(
          result => console.log(result, '업로드 완료'),
          err => {
            console.log('게시글 전송실패', err);
          },
        );
    } catch (e) {
      console.log(e.code, e.message);
    }
    navigation.goBack('TabBar', {screen: 'Community'});
  };

  return (
    <>
      <Container>
        <Card>
          <UserInfo>
            <UserImg source={{uri: myProfileData.profile_image}} />
            <UserInfoText>
              <UserName>{myProfileData.nickname}</UserName>
            </UserInfoText>
          </UserInfo>
          <UploadContainer>
            <PostText
              multiline={true}
              autoFocus={true}
              numberOfLines={8}
              placeholder="내용을 입력해주세요"
              value={postContent}
              onChangeText={text => {
                setPostContent(text);
              }}
            />
            <Divider />
            <MusicUploadBtn
              onPress={async () => {
                console.log('clicked');
                navigation.navigate('Stack', {
                  screen: 'SearchMusic',
                  params: {
                    page: 'CommunityUpload',
                  },
                });
              }}>
              <Ionicons name="add" size={25} />
              <BtnText>
                {!route.params ? '음악 올리기 ' : '음악 수정하기'}
              </BtnText>
            </MusicUploadBtn>
            {route.params ? (
              <SelectContainer>
                <SelectedImg source={{uri: route.params.albumImg}} />
                <SelectedMusic>
                  {route.params.albumTitle} - {route.params.albumArtistName}
                </SelectedMusic>
              </SelectContainer>
            ) : null}
            <Divider />
            <ImgUploadBtn onPress={handleImgUpload}>
              <Ionicons name="camera-outline" size={25} />
              <BtnText>사진 가져오기</BtnText>
            </ImgUploadBtn>
            <SelectContainer>
              {uploadImgs[0]
                ? uploadImgs.map(data => {
                    return (
                      <SelectedImg
                        source={{
                          uri:
                            'file://' +
                            (uploadImgs?.crop?.cropPath ?? data.path),
                        }}
                      />
                    );
                  })
                : null}
            </SelectContainer>
          </UploadContainer>
        </Card>
        <SubmitBtn onPress={onSubmitPost}>
          <Ionicons name="checkmark-outline" size={25} />
          <BtnText> 업로드하기 </BtnText>
        </SubmitBtn>
      </Container>
    </>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #b7b4df;
  justify-content: center;
  align-items: center;
`;
const Card = styled.View`
  background-color: #f8f8f8;
  width: 90%;
  margin-top: 12px;
  padding: 12px;
  border-radius: 10px;
`;

const UserInfo = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  padding: 15px;
`;

const UserImg = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;
const UserInfoText = styled.View`
  flex-direction: column;
  justify-content: center;
  margin-left: 15px;
`;

const UserName = styled.Text`
  font-size: 14px;
  font-weight: bold;
`;
const UploadContainer = styled.View`
  align-items: center;
`;
const PostText = styled.TextInput`
  width: 90%;
  border: 1px solid #dddddd;
  //text-align: center;
  padding: 10px;
`;
const Divider = styled.View`
  border-bottom-color: #dddddd;
  border-bottom-width: 1px;
  width: 90%;
  margin-top: 15px;
  align-self: center;
`;

const MusicUploadBtn = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  padding: 8px;
`;
const ImgUploadBtn = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  padding: 8px;
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
const SubmitBtn = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  padding: 8px;
  margin: 12px;
  border-radius: 15px;
  background-color: white;
`;

const BtnText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  margin: 5px;
  color: ${props => (props.active ? '#2e64e5' : '#333')};
`;

export default CommunityUpload;
