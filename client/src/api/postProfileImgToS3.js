import Config from 'react-native-config';
import RNFetchBlob from 'rn-fetch-blob';

const postProfileImgToS3 = async profileImgData => {
  const BASE_URL = Config.BASE_URL;
  const result = await (
    await RNFetchBlob.fetch(
      'PUT',
      `${BASE_URL}/s3/profile-img`,
      {
        'Content-Type': 'multipart/form-data',
      },
      [
        {
          name: 'profileImg',
          filename: profileImgData.fileName,
          data: RNFetchBlob.wrap(profileImgData.path),
        },
      ],
    )
  ).json();
  return result;
};

export default postProfileImgToS3;
