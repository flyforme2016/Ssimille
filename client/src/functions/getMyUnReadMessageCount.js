import {getDoc} from 'firebase/firestore';
import getRef from '../functions/getRef'
  
const getMyUnReadMessageCount = async (myUid, otherUid) => {
    const myUnReadMessageRef = getRef.unReadMessageRef(myUid, otherUid);

    const myUnreadMessageDocSnap = await getDoc(myUnReadMessageRef) //상대방과의 대화에서 내가 읽지 않은 메세지 count = 0 으로 초기화
    if(myUnreadMessageDocSnap.exists()){
        return myUnreadMessageDocSnap.data().count
    }else{
        return 0
    }
};
  
export default getMyUnReadMessageCount;