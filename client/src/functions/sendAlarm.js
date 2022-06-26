import Config from 'react-native-config';
import getRef from './getRef';
import {addDoc} from 'firebase/firestore';
const BASE_URL = Config.BASE_URL;

//type 1 : 친구신청, 0:게시글
//dataObject : userData/postData
const sendAlarm = (myUid, dataObject, text, type) => {
  console.log('Enter addFriend');
  console.log('otherUserData: ', dataObject);

  if (type) {
    requestFriend();
  }
  async function requestFriend() {
    const requestOptions = {
      method: 'POST',
      redirect: 'follow',
      body: JSON.stringify({
        myUid: myUid,
        otherUid: dataObject.kakao_user_number,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    await fetch(`${BASE_URL}/friend/addFriend`, requestOptions)
      .then(res => console.log('res: ', res))
      .catch(err => console.log('err:', err));
  }
  const alarmRef = getRef.alarmRef(myUid);
  let addDocObject;
  if (type) {
    addDocObject = {
      nickname: dataObject.nickname,
      profileImg: dataObject.profile_image,
      text,
      text,
      createdAt: new Date(+new Date() + 3240 * 10000)
        .toISOString()
        .replace('T', ' ')
        .replace(/\..*/, ''),
      deleteKey: Date.now(),
      moveKey: myUid,
      type: type,
    };
  } else {
    addDocObject = {
      nickname: dataObject.nickname,
      profileImg: dataObject.profile_image,
      text,
      text,
      createdAt: new Date(+new Date() + 3240 * 10000)
        .toISOString()
        .replace('T', ' ')
        .replace(/\..*/, ''),
      deleteKey: Date.now(),
      moveKey: dataObject.post_seq,
      type: type,
    };
  }
  addDoc(alarmRef, addDocObject);
};

export default sendAlarm;
