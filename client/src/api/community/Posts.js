import axios from 'axios';
import Config from 'react-native-config';

const BASE_URL = Config.BASE_URL;

export const deletePost = async (kakaoUid, seq) => {
  try {
    await axios.delete(`${BASE_URL}/post`, {
      data: {key: kakaoUid, postSeq: seq},
    });
  } catch {
    err => console.log(err);
  }
};
export const uploadPost = async (
  myProfileData,
  locationName,
  route,
  postContent,
  submitImgs,
) => {
  console.log('2: enter submit post', myProfileData);
  try {
    await axios
      .post(`${BASE_URL}/post`, {
        key: myProfileData.kakao_user_number,
        regionDepth1: locationName.region_1depth_name
          ? locationName.region_1depth_name
          : null,
        addressName: locationName.address_name
          ? locationName.address_name
          : null,
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
};
