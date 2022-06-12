import React, {useState} from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CommunityUpload = ({navigation: {navigate}}) => {
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
  const searchMusic = async () => {
    // const name = 'bts';
    // const token =
    //   'BQDgtwxbj0aEKKwHTs-UyWFJ_4NNXBoeAtMoi1eal3N3Hu4wL1eCD5l9w2qWJFf0zYRQf4ktxV5GcYGalju3ElT0FZ8jEDdRy3sZXFfNra-Cx0tJoaeKm7fVpHkhg-jJljh1a4IOZVhB3MfkctTBCQS5XlyALwh7z8ONoe0';

    // const {data} = await axios
    //   .get('https://api.spotify.com/v1/search', {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //     params: {
    //       q: name,
    //       type: 'track',
    //     },
    //   })
    //   .then(res => {
    //     console.log('res.data: ', res.data);
    //   })
    //   .catch(err => {
    //     console.log('err: ', err);
    //   });
    console.log('clicked');
    await axios
      .get(
        'http://ws.audioscrobbler.com/2.0/?method=track.search&track=Believe&api_key=8d9fa3281b6b3aad9ce7665f929b0048&format=json',
      )
      .then(res => {
        console.log('res.data: ', res.data);
      });
  };

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
    const kakao = await AsyncStorage.getItem('userNumber');
    try {
      submitPhotos();
      await axios
        .post('http://192.168.0.105:3000/url', {
          params: {
            key: kakao,
            locationDepth1: 'testLocationDepth1',
            engLocationDepth1: 'testEngLocationDepth1',
            musicUri: 'testMusicUri',
            albumTitle: 'testAlbumTitle',
            albumImg: 'testAlbumImg',
            albumArtistName: 'testAlbumArtistName',
            inputText: postContent,
            image1: 'testImage1',
            image2: 'testImage2',
            image3: 'testImage3',
            image4: 'testImage4',
            image5: 'testImage5',
          },
        })
        .then(result => console.log(result, '업로드 완료'))
        .then(navigate('TabBar', {screen: 'Community'}));
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
            onPress={() => navigate('Stack', {screen: 'SearchMusic'})}>
            <Ionicons name="add" size={25} />
            <BtnText>음악 올리기</BtnText>
          </MusicUploadBtn>
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
