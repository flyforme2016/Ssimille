import Config from 'react-native-config';
const BASE_URL = Config.BASE_URL;

const requestFriend = (myUid, otherUid) => {
  async function addFriendApi() {
    const requestOptions = {
      method: 'POST',
      redirect: 'follow',
      body: JSON.stringify({
        myUid: myUid,
        otherUid: otherUid,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    await fetch(`${BASE_URL}/friend`, requestOptions)
      .then(res => console.log('res: ', res))
      .catch(err => console.log('err:', err));
  }
  addFriendApi();
};

export default requestFriend;
