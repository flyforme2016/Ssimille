import React, {useState, useLayoutEffect, useCallback} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  setDoc,
  orderBy,
  query,
  onSnapshot,
  doc,
} from 'firebase/firestore';
import {database} from '../../config/firebase';
import {useSelector} from 'react-redux';

export default function Chat({route}) {
  const OtherUid = route.params.otherUid;
  const stringOtherUid = OtherUid.toString();
  const [messages, setMessages] = useState([]);
  const myData = useSelector(state => state.myProfile);
  const myUid = myData.myProfileData.kakao_user_number.toString();
  console.log('myData: ', myData);
  console.log('myData.myProfileData: ', myData.myProfileData);
  console.log('OtherUid: ', stringOtherUid)
  //useLayoutEffect vs useEffect
  //useLayoutEffect : 화면이 그려지기 전에 Dom 관련 데이터를 먼저 동기적으로 처리해줌
  useLayoutEffect(() => {
    const getChattingLog = async () => {
      console.log('start getChattingLog');
      //firestore DB에서 채팅 데이터 get -> setMessage로 messages에 할당
      const collectionRef = collection(database, 'chats');
      const documentRef = doc(collectionRef, myUid);
      const realCollectionRef = collection(documentRef, stringOtherUid);
      const q = query(realCollectionRef, orderBy('createdAt', 'desc')); //'desc' : 내림차순 정렬 -> 채팅 내용을 최신순으로 정렬

      const unsubscribe = onSnapshot(q, querySnapshot => {
        console.log('querySnapshot unsusbscribe');
        setMessages(
          querySnapshot.docs.map(doc => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
          })),
        );
      });
      return unsubscribe;
    };
    getChattingLog();

    //return unsubscribe; //hook 상태 관리에서 return은 clean 작업을 의미하는데 ChatScreen.js가 unmount된 후
    //다시 호출되어 mount될 시 어차피 다시 데이터를 불러오기 때문에 unmount 시점에 return unsubscribe로
    //messages를 메모리 초기화? 시켜주는 것.
  }, []);

  //메세지 전송 firestore에 저장
  const onSend = useCallback((messages = []) => {
    const getMyUid = async () => {
      const collectionRef = collection(database, 'chats'); //chats
      const documentRef = doc(collectionRef, myUid); //myUid
      const realCollectionRef = collection(documentRef, stringOtherUid); //otherUid

      const collectionRef2 = collection(database, 'chats'); //chats
      const documentRef2 = doc(collectionRef2, stringOtherUid); //myUid stringOtherUid
      const realCollectionRef2 = collection(documentRef2, myUid); //otherUid

      const collectionRef3 = collection(database, 'chatList');
      const documentRef3 = doc(collectionRef3, myUid);
      const realCollectionRef3 = collection(documentRef3, 'chatList');
      const realDocumentRef = doc(realCollectionRef3, stringOtherUid)

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );
      // setMessages([...messages, ...messages]);
      const {_id, createdAt, text, user} = messages[0];
      addDoc(realCollectionRef, {
        _id,
        createdAt,
        text,
        user,
      });
      addDoc(realCollectionRef2, {
        _id,
        createdAt,
        text,
        user,
      });
      setDoc(realDocumentRef, {
        _id,
        createdAt,
        text,
        user,
      })

    };
    getMyUid();
  }, []);

  return (
    //messages state에 저장된 채팅내용을 랜더링
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false} //메세지를 한번에 여러개 보낼 경우 가장 첫 메세지에만 프로필 사진 띄워주기
      showUserAvatar={false} //채팅창에서 내 프로필 사진은 보이지 않도록 설정
      onSend={messages => onSend(messages)}
      messagesContainerStyle={{
        backgroundColor: '#fff',
      }}
      textInputStyle={{
        backgroundColor: '#fff',
        borderRadius: 20,
      }}
      user={{
        _id: myUid,
        name: myData.myProfileData.nickname,
        avatar: myData.myProfileData.profile_image,
      }}
    />
  );
}