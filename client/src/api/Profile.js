import axios from 'axios';
import Config from 'react-native-config';

const BASE_URL = Config.BASE_URL;

export const postProfileImgToS3 = async profileImgData => {
  const formdata = new FormData();
  console.log('profileImgData.path', profileImgData.path);
  formdata.append('profileImg', {
    uri: 'file://' + profileImgData.path,
    type: profileImgData.mime,
    name: profileImgData.fileName,
  });
  const requestOptions = {
    method: 'PUT',
    body: formdata,
    redirect: 'follow',
  };
  const result = await (
    await fetch(`${BASE_URL}/s3/profile-image`, requestOptions)
  ).json();

  // const result = await (
  //   await RNFetchBlob.fetch(
  //     'PUT',
  //     `${BASE_URL}/s3/profile-image`,
  //     {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //     [
  //       {
  //         name: 'profileImg',
  //         filename: profileImgData.fileName,
  //         data: RNFetchBlob.wrap(profileImgData.path),
  //       },
  //     ],
  //   )
  // ).json();
  return result;
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
      profileImg: result ? result.imgUrl : routeDatas.profileImg,
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
