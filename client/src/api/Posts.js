import axios from 'axios';
import Config from 'react-native-config';

const BASE_URL = Config.BASE_URL;

export const uploadImages = async uploadImgs => {
  try {
    const formdata = new FormData();
    await uploadImgs.map(image => {
      formdata.append('multipleImg', {
        uri: image.path.includes(':') ? image.path : 'file://' + image.path,
        type: image.mime,
        name: image.fileName,
      });
    });
    const result = await axios.post(`${BASE_URL}/s3/post-images`, formdata, {
      redirect: 'follow',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data, headers) => {
        return data;
      },
    });
    return result.data;
  } catch (error) {
    console.log(error.response.data);
  }
};

export const uploadPost = async (
  myProfileData,
  locationName,
  route,
  postContent,
  submitImgs,
) => {
  try {
    await axios.post(`${BASE_URL}/post`, {
      key: myProfileData.kakao_user_number,
      regionDepth1: locationName.region_1depth_name
        ? locationName.region_1depth_name
        : null,
      addressName: locationName.address_name ? locationName.address_name : null,
      musicUri: route.params ? route.params.musicUri : null,
      albumTitle: route.params ? route.params.albumTitle : null,
      albumImg: route.params ? route.params.albumImg : null,
      albumArtistName: route.params ? route.params.albumArtistName : null,
      inputText: postContent ? postContent : null,
      images: submitImgs,
    });
  } catch (e) {
    console.log(e.code, e.message);
  }
};

export const deletePost = async (kakaoUid, seq) => {
  try {
    await axios.delete(`${BASE_URL}/post`, {
      data: {key: kakaoUid, postSeq: seq},
    });
  } catch {
    err => console.log(err);
  }
};

export const postLike = async (kakaoUid, seq, like) => {
  try {
    await axios.post(`${BASE_URL}/post/like`, {
      key: kakaoUid,
      postSeq: seq,
      check: !like,
    });
  } catch {
    err => console.log(err);
  }
};
