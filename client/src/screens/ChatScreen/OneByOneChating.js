import React, {useState, useLayoutEffect, useCallback, useEffect} from 'react';
import {GiftedChat, Bubble, InputToolbar, Send} from 'react-native-gifted-chat';
import {
  addDoc,
  setDoc,
  getDoc,
  orderBy,
  query,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import {useSelector} from 'react-redux';
import getRef from '../../functions/getRef'
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View} from 'react-native';
import styled from 'styled-components/native';


export default function Chat({route}) {
  const otherUid = route.params.otherUid;
  const stringOtherUid = otherUid.toString();
  const otherNickname = route.params.otherNickname;
  const otherProfleImg = route.params.otherProfleImg;
  const [messages, setMessages] = useState([]);
  const myData = useSelector(state => state.myProfile);
  const myUid = myData.myProfileData.kakao_user_number.toString();
  const myChatsRef = getRef.chatsRef(myUid, stringOtherUid) //my chats update
  const otherChatsRef = getRef.chatsRef(stringOtherUid, myUid); //other chats update
  const myChatListRef = getRef.chatListRef(myUid, stringOtherUid) //my chatList update
  const otherChatListRef = getRef.chatListRef(stringOtherUid, myUid) //other chatList update
  const myChatListCollectionRef = getRef.myChatListCollectionRef(myUid);

  useLayoutEffect(() => {
    const getChattingLog = async () => {
      console.log('start getChattingLog');

      const myChatListDocSnap = await getDoc(myChatListRef)     //채팅방 입장 시 stack = 0 으로 초기화
      if(myChatListDocSnap.exists() && myChatListDocSnap.data().stack !== 0){
        updateDoc(myChatListRef, {
          stack: 0
        })
      }

      const q2 = query(myChatsRef, orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q2, querySnapshot => {
        console.log('Second onSnapshot')
        setMessages(
          querySnapshot.docs.map(doc => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
          })),
        );
      })

      return unsubscribe;
    };
    getChattingLog();

    //return unsubscribe; //hook 상태 관리에서 return은 clean 작업을 의미하는데 ChatScreen.js가 unmount된 후
    //다시 호출되어 mount될 시 어차피 다시 데이터를 불러오기 때문에 unmount 시점에 return unsubscribe로
    //messages를 메모리 초기화? 시켜주는 것.
  }, []);

  useEffect(() => {
    const q = query(myChatListCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, querySnapshot => {
      console.log('First onSnapshot')
      querySnapshot.docChanges().map(change => {        //실시간으로 대화하는 중에 상대방에게 메세지를 받을 경우에도
        if(change.type === 'modified'){                //상대방이 증가시키는 stack 0으로 초기화
          if(change.doc.data().setDocUserObj._id === stringOtherUid){   //대화목록중 현재 실시간 채팅중인 유저와의 chatList를 찾으면
            updateDoc(myChatListRef, {
              stack:0
            })
          }
        }
      })
    });
    return unsubscribe
  })


  //메세지 전송 firestore에 저장
  const onSend = useCallback((messages = []) => {
    const getMyUid = async () => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );

      const {_id, createdAt, text, user} = messages[0];

      const otherChatListDocSnap = await getDoc(otherChatListRef)
      if(otherChatListDocSnap.exists()){
        setDoc(otherChatListRef, {
          _id,
          createdAt,
          text,
          setDocUserObj: user,
          stack : otherChatListDocSnap.data().stack + 1
        })
      }else{
        setDoc(otherChatListRef, {
          _id,
          createdAt,
          text,
          setDocUserObj: user,
          stack : 1
        })
      }
      setDoc(myChatListRef, { //my chatList update
        _id,
        createdAt,
        text,
        setDocUserObj : {
          _id: stringOtherUid,
          name: otherNickname,
          avatar: otherProfleImg,
        },
        stack : 0
      })

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
    };
    getMyUid();
  }, []);

  const renderSend = props => {
    return (
      <Send {...props}>
        <View>
          <Ionicons name="send-sharp" size={35} color="#9b59b6" />
        </View>
      </Send>
    );
  };

  return (
    //messages state에 저장된 채팅내용을 랜더링
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FLATLIST source={require('../../assets/sample/background.jpg')} />
      <GiftedChat
        placeholder="메세지를 입력해주세요"
        alwaysShowSend={true}
        messages={messages}
        renderSend={renderSend}
        onSend={messages => onSend(messages)}
        user={{
          _id: myUid,
          name: myData.myProfileData.nickname,
          avatar: myData.myProfileData.profile_image,
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: '#b7b4df',
                },
              }}
            />
          );
        }}
        renderInputToolbar={props => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{borderTopColor: '#b7b4df'}}
              textInputStyle={{color: '#9b59b6'}}
            />
          );
        }}
      />
    </View>
  );
}

const FLATLIST = styled.ImageBackground`
  position: absolute;
  resize-mode: stretch;
  width: 100%;
  height: 100%;
`;