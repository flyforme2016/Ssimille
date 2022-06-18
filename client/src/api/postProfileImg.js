import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

const postProfileImg = async parameter => {
  const BASE_URL = Config.BASE_URL;

  const value = await AsyncStorage.getItem('userNumber');
  if (value !== null) {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({profileImg: parameter, key: value}),
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await fetch(
      ` ${BASE_URL}/profile/updateProfileImg`, //1.upload image API to S3
      requestOptions,
    )
      .then(response => response.text())
      .then(result => console.log('result: ', result));
  }
};
export default postProfileImg;
