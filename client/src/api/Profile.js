import axios from 'axios';
import Config from 'react-native-config';

const BASE_URL = Config.BASE_URL;

export const postProfileImgToS3 = async profileImgData => {
  try {
    const formdata = new FormData();
    formdata.append('profileImg', {
      uri: profileImgData.path.includes(':')
        ? profileImgData.path
        : 'file://' + profileImgData.path,
      type: profileImgData.mime,
      name: profileImgData.fileName,
    });
    const result = await axios.put(`${BASE_URL}/s3/profile-image`, formdata, {
      redirect: 'follow',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data, headers) => {
        return data;
      },
    });
    return result.data.imgUrl;
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (
  kakaoUid,
  changeName,
  routeDatas,
  result,
  myProfileData,
  idx,
  visible,
  artistUri,
) => {
  try {
    const res = await axios.put(`${BASE_URL}/users/profile`, {
      key: kakaoUid,
      nickname: changeName ? changeName : routeDatas.nickname,
      profileImg: result ? result : routeDatas.profileImg,
      profileMusicUri: routeDatas.musicUri
        ? routeDatas.musicUri
        : myProfileData.profile_music_uri,
      albumArtistName: routeDatas.albumArtistName
        ? routeDatas.albumArtistName
        : myProfileData.album_artist_name,
      albumTitle: routeDatas.albumTitle
        ? routeDatas.albumTitle
        : myProfileData.album_title,
      albumImage: routeDatas.albumImg
        ? routeDatas.albumImg
        : myProfileData.album_image,
      hashTag: idx ? idx : routeDatas.hashTag,
      artistUri: visible ? artistUri : null,
    });
    return res;
  } catch {
    err => console.log(err);
  }
};
