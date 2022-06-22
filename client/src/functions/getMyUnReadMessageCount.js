import {collection, getDoc, doc} from 'firebase/firestore';
import { database } from '../config/firebase';
  
const getMyUnReadMessageCount = async (myUid, otherUid) => {
    console.log('myUid: ', myUid + 'otherUid: ', otherUid) 
    const chatsCollectionRef = collection(database, 'chats');
    const chatsDocumentRef = doc(chatsCollectionRef, myUid);
    const chatsFinalCollectionRef = collection(chatsDocumentRef, otherUid);
    
    const myUnReadMessageRef = doc(chatsFinalCollectionRef, 'unReadMessage');
    const myUnreadMessageDocSnap = await getDoc(myUnReadMessageRef) //상대방과의 대화에서 내가 읽지 않은 메세지 count = 0 으로 초기화
    if(myUnreadMessageDocSnap.exists()){
        return myUnreadMessageDocSnap.data().count
    }else{
        return 0
    }
};
  
export default getMyUnReadMessageCount;