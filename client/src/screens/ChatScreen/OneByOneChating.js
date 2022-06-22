import React, {useState, useLayoutEffect, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  addDoc,
  setDoc,
  getDoc,
  orderBy,
  query,
  onSnapshot,
} from 'firebase/firestore';
import {useSelector} from 'react-redux';
import getRef from '../../functions/getRef'

export default function Chat({route}) {
  const otherUid = route.params.otherUid;
  const stringOtherUid = otherUid.toString();
  const otherNickname = route.params.otherNickname;
  const otherProfleImg = route.params.otherProfleImg;
  const [messages, setMessages] = useState([]);
  const [otherUnReadMessageCount, setOtherUnreadMessageCount] = useState(0);
  const myData = useSelector(state => state.myProfile);
  const myUid = myData.myProfileData.kakao_user_number.toString();

  const myChatsRef = getRef.chatsRef(myUid, stringOtherUid)
  const myUnReadMessageRef = getRef.unReadMessageRef(myUid, stringOtherUid)

  const otherChatsRef = getRef.chatsRef(stringOtherUid, myUid); //상대방과의 대화에서 상대방쪽 읽지 않은 메세지 update
  const otherUnreadMessageRef = getRef.unReadMessageRef(stringOtherUid, myUid);

  const myChatListRef = getRef.chatListRef(myUid, stringOtherUid) //my chatList update

  const otherChatListRef = getRef.chatListRef(stringOtherUid, myUid) //other chatList update

  useLayoutEffect(() => {
    const getChattingLog = async () => {
      console.log('start getChattingLog');
      //firestore DB에서 채팅 데이터 get -> setMessage로 messages에 할당
      const myUnreadMessageDocSnap = await getDoc(myUnReadMessageRef) //상대방과의 대화에서 내가 읽지 않은 메세지 count = 0 으로 초기화
      if(myUnreadMessageDocSnap.exists()){
        console.log('myUnreadMessageDocSnap.data(): ', myUnreadMessageDocSnap.data())
        setDoc(myUnReadMessageRef, {
          count:0
        })
      }

      const q = query(myChatsRef, orderBy('createdAt', 'desc')); //'desc' : 내림차순 정렬 -> 채팅 내용을 최신순으로 정렬
      const unsubscribe = onSnapshot(q, querySnapshot => {
        querySnapshot.docChanges().map(change => {        //실시간으로 대화하는 중에 상대방에게 메세지를 받을 경우에도
          if(change.type === 'added'){                    //myUnreadMessageCount를 초기화 해주는 것.
            if(change.doc.data()._id === stringOtherUid){
              console.log('added other')
              setDoc(myUnReadMessageRef, {
                count:0
              })
            }
          }
        })
      
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

  useEffect(()=>{
    const setOtherUnReadMessageCount = async()=>{
      setDoc(otherUnreadMessageRef, {
        count:otherUnReadMessageCount,
      })
    }
    if(otherUnReadMessageCount){
      setOtherUnReadMessageCount()
    }
  }, [otherUnReadMessageCount])

  //메세지 전송 firestore에 저장
  const onSend = useCallback((messages = []) => {
    const getMyUid = async () => {
      const otherUnreadMessageDocSnap = await getDoc(otherUnreadMessageRef)
      if(otherUnreadMessageDocSnap.exists()){
        setOtherUnreadMessageCount(otherUnreadMessageDocSnap.data().count+1)
      } else{
        setOtherUnreadMessageCount(1);
      }

      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );

      const {_id, createdAt, text, user} = messages[0];

      addDoc(myChatsRef, {
        _id,
        createdAt,
        text,
        user,
      });
      addDoc(otherChatsRef, {
        _id,
        createdAt,
        text,
        user,
      });
      setDoc(myChatListRef, { //my chatList update
        _id,
        createdAt,
        text,
        setDocUserObj : {
          _id: stringOtherUid,
          name: otherNickname,
          avatar: otherProfleImg,
        },
      })
      setDoc(otherChatListRef, {  //other chatList update
        _id,
        createdAt,
        text,
        setDocUserObj : user
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