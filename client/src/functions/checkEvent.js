import {getDocs, query, where} from 'firebase/firestore';
import sendAlarm from './sendAlarm';

const checkEvent = async (currentMusicListRef, querySnapshot, myData) => {
  let myCurrentMusic;
  let eventUserArray = [];

  //사용자가 현재 듣고 있는 노래 get
  //추후 SpotifyTab에서 사용자 현재 재생곡 redux관리 고려
  const q = query(
    currentMusicListRef,
    where('uid', '==', myData.kakao_user_number),
  );
  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    myCurrentMusic = doc.data().musicUri;
  });

  querySnapshot.docs.map(doc => {
    if (
      myCurrentMusic === doc.data().musicUri &&
      myData.kakao_user_number !== doc.data().uid
    ) {
      eventUserArray.push({
        uid: doc.data().uid,
        nickname: doc.data().nickname,
        profileImg: doc.data().profileImg,
      });
      //상대방에게 전송하는 알림
      sendAlarm(
        {
          uid: myData.kakao_user_number.toString(),
          nickname: myData.nickname,
          profile_image: myData.profile_image,
        },
        {
          kakao_user_number: doc.data().uid,
        },
        doc.data().nickname +
          '님과 같은 음악' +
          '(' +
          doc.data().albumTitle +
          ')' +
          '을 듣고 있어요~!.',
        2,
      );
    }
  });
  return eventUserArray;
};

export default checkEvent;
