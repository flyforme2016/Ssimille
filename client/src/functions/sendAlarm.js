import getRef from './getRef';
import {addDoc} from 'firebase/firestore';
import requestFriend from '../api/requestFriend';
import updateAlarmStack from './updateAlarmStack';
//type 1 : 친구신청, 0:게시글
//dataObject : userData/postData
const sendAlarm = (myData, dataObject, text, type) => {
  const alarmRef = getRef.alarmColRef(dataObject.kakao_user_number.toString()); //상대방 uid
  const stackAlarmRef = getRef.alarmStackDocRef(dataObject.kakao_user_number.toString());
  if (type) { //친구요청 알람인 경우
    requestFriend(myData.uid, dataObject.kakao_user_number);
  }
  
  let addDocObject;
  if (type) {
    addDocObject = {
      nickname: myData.nickname,
      profileImg: myData.profile_image,
      text: text,
      createdAt: new Date(+new Date() + 3240 * 10000)
        .toISOString()
        .replace('T', ' ')
        .replace(/\..*/, ''),
      deleteKey: Date.now(),
      moveKey: myData.uid,
      type: type,
      readState: 0
    };
  } else {
    addDocObject = {
      nickname: myData.nickname,
      profileImg: myData.profile_image,
      text: text,
      createdAt: new Date(+new Date() + 3240 * 10000)
        .toISOString()
        .replace('T', ' ')
        .replace(/\..*/, ''),
      deleteKey: Date.now(),
      moveKey: dataObject.post_seq,
      type: type,
      readState: 0
    };
  }
  addDoc(alarmRef, addDocObject);
  updateAlarmStack.increase(stackAlarmRef)
  
};

export default sendAlarm;
