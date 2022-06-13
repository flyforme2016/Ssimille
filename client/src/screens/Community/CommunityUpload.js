import React, {useState} from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CommunityUpload = ({navigation, route}) => {
  const [uploadImg, setUploadImg] = useState();
  const [postContent, setPostContent] = useState();

  const handlePostContent = text => {
    setPostContent(text);
  };
  //게시글에 사진 추가하는 함수
  const handleImgUpload = async () => {
    try {
      const response = await MultipleImagePicker.openPicker({
        selectedAssets: uploadImg,
        mediaType: 'image',
        isExportThumbnail: true,
        isCrop: true,
        isCropCircle: true,
      });
      console.log('response: ', response);
      await setUploadImg(response);
    } catch (e) {
      console.log(e.code, e.message);
    }
  };
  //사진 업로드
  const submitPhotos = async event => {
    event.preventDefault();
    try {
      const formdata = new FormData();

      await uploadImg.map(image => {
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
      };

      await fetch(
        'http://192.168.0.105:3000/s3/uploadMultipleImg',
        requestOptions,
      )
        .then(response => response.text())
        .then(result => console.log(result));
    } catch (e) {
      console.log(e.code, e.message);
    }
  };

  const onSubmitPost = async () => {
    const value = await AsyncStorage.getItem('userNumber');
    try {
      submitPhotos();
      await axios
        .post('http://192.168.0.124:3000/post/uploadPost', {
          params: {
            kakao_user_number: value,
            del_ny: 0,
            location_depth1: args[2].locationDepth1,
            eng_location_depth1: args[2].engLocationDepth1,
            music_uri: args[2].musicUri,
            album_title: args[2].albumTtile,
            album_image: args[2].albumImg,
            album_artist_name: args[2].albumArtistName,
            input_text: postContent,
            like_count: 0,
            reg_time: Date.now(),
          },
        })
        .then(
          result => console.log(result, '업로드 완료'),
          err => {
            console.log('게시글 정보 받아오기 실패', err);
          },
        )
        .then(navigation.navigate('TabBar', {screen: 'Community'}));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <Card>
        <UserInfo>
          <UserImg source={require('../../assets/sample/1.jpg')} />
          <UserInfoText>
            <UserName>윤승희</UserName>
          </UserInfoText>
        </UserInfo>
        <UploadContainer>
          <PostText
            placeholder="내용을 입력해주세요"
            value={postContent}
            onChangeText={handlePostContent}
          />
          <Divider />
          <MusicUploadBtn
            onPress={() =>
              navigation.navigate('Stack', {screen: 'SearchMusic'})
            }>
            <Ionicons name="add" size={25} />
            <BtnText>음악 올리기</BtnText>
          </MusicUploadBtn>
          {route.params ? (
            <SelectedMusic>
              선택한 노래 : {route.params.name} - {route.params.artist}
            </SelectedMusic>
          ) : null}
          <Divider />
          <ImgUploadBtn onPress={handleImgUpload}>
            <Ionicons name="camera-outline" size={25} />
            <BtnText>사진 가져오기</BtnText>
          </ImgUploadBtn>
        </UploadContainer>
      </Card>
      <SubmitBtn onPress={onSubmitPost}>
        <Ionicons name="checkmark-outline" size={25} />
        <BtnText> 업로드하기 </BtnText>
      </SubmitBtn>
    </Container>
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
  height: 80%;
  margin: 20px;
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
  height: 60%;
  border: 1px solid #dddddd;
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

const SelectedMusic = styled.Text`
  font-size: 12px;
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
