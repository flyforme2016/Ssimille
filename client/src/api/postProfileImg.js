import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const postProfileImg = async parameter => {
  console.log('Enter postProfileImgApi');
  console.log('profileImg: ', parameter);
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
      'http://192.168.0.104:3000/profile/updateProfileImg', //1.upload image API to S3
      requestOptions,
    )
      .then(response => response.text())
      .then(result => console.log('result: ', result));

    // await axios
    //   .post('http://192.168.0.104:3000/profile/updateProfileImg', {
    //     profileImg: parameter,
    //     key: value,
    //   })
    //   .then(response => response.statusText())
    //   .then(result => console.log('result: ', result));
  }
};
export default postProfileImg;
