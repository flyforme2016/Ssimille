import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const postProfileImg = async parameter => {
  console.log('Enter postProfileImgApi');
  const value = await AsyncStorage.getItem('userNumber');
  if (value !== null) {
    await axios
      .post('http://192.168.0.105:3000/profile/updateProfileImg', {
        profileImg: parameter,
        key: value,
      })
      .then(result => console.log('result: ', result));
  }
};
export default postProfileImg;
