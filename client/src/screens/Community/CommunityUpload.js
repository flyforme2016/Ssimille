import React, {useState} from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';

const CommunityUpload = ({navigation: {navigate}}) => {
  const [uploadImg, setUploadImg] = useState();
  const [postContent, setPostContent] = useState();

  const handlePostContent = e => {
    const {text} = e.nativeEvent;
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
  const handleUploadPost = async event => {
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
        'http://192.168.0.106:3000/s3/uploadMultipleImg',
        requestOptions,
      )
        .then(response => response.text())
        .then(result => console.log(result))
        .then(navigate('TabBar', {screen: 'Community'}));
    } catch (e) {
      console.log(e.code, e.message);
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
          <ImgUploadBtn onpress={handleImgUpload}>
            <Ionicons name="add" size={25} />
            <BtnText>사진 가져오기</BtnText>
          </ImgUploadBtn>
        </UploadContainer>
      </Card>
      <SubmitBtn onpress={handleUploadPost}>
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
