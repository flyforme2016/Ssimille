import React, {useState, useLayoutEffect} from 'react';
import {FlatList} from 'react-native';
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../../../styles/MessageStyles';
import styled from 'styled-components/native';
import {
  collection,
  getDoc,
  orderBy,
  query,
  onSnapshot,
  doc,
} from 'firebase/firestore';
import {database} from '../../config/firebase';
import SpotifyTab from '../../components/SpotifyTab';
import {useSelector} from 'react-redux';
import getChatListTime from '../../api/getChatListTime';
import {async} from '@firebase/util';
// import {useSelector} from 'react-redux';

const ChatingList = ({navigation: {navigate, push}}) => {
  const [messages, setMessages] = useState([]);
  const myData = useSelector(state => state.myProfile);
  const myUid = myData.myProfileData.kakao_user_number.toString();
  //console.log(messages);

  const getMyUnReadMessageCount = async otherUid => {
    console.log('check');
    console.log('otherUid: ', otherUid);
    const chatsCollectionRef = collection(database, 'chats');
    const chatsDocumentRef = doc(chatsCollectionRef, myUid);
    const chatsFinalCollectionRef = collection(chatsDocumentRef, otherUid);
    const myUnReadMessageRef = doc(chatsFinalCollectionRef, 'unReadMessage');

    const myUnreadMessageDocSnap = await getDoc(myUnReadMessageRef); //상대방과의 대화에서 내가 읽지 않은 메세지 count = 0 으로 초기화

    if (myUnreadMessageDocSnap.exists()) {
      return myUnreadMessageDocSnap.data().count;
    } else {
      return 0;
    }
  };

  useLayoutEffect(() => {
    const getChatList = async () => {
      console.log('start getChatList');

      //firestore DB에서 채팅 데이터 get -> setMessage로 messages에 할당
      const collectionRef = collection(database, 'chatList');
      const documentRef = doc(collectionRef, myUid);
      const realCollectionRef = collection(documentRef, 'chatList');
      const q = query(realCollectionRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, querySnapshot => {
        console.log('querySnapshot unsusbscribe');

        querySnapshot.docs.map(async doc => {
          const datas = {
            _id: doc.data()._id,
            createdAt: getChatListTime(
              doc.data().createdAt.toDate().toISOString(),
            ),
            text: doc.data().text,
            user: doc.data().setDocUserObj,
            count: await getMyUnReadMessageCount(doc.data().setDocUserObj._id),
          };
          setMessages(prev => [...prev, datas]);
        });
      });
      return unsubscribe;
    };

    getChatList();
    //return unsubscribe; //hook 상태 관리에서 return은 clean 작업을 의미하는데 ChatScreen.js가 unmount된 후
    //다시 호출되어 mount될 시 어차피 다시 데이터를 불러오기 때문에 unmount 시점에 return unsubscribe로
    //messages를 메모리 초기화? 시켜주는 것.
  }, []);

  return (
    <>
      <Container>
        <NavText>채팅창</NavText>

        <FlatList
          data={messages}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <Card
              onPress={() =>
                push('Stack', {
                  screen: 'OneByOneChating',
                  params: {
                    otherProfleImg: item.user.avatar,
                    otherNickname: item.user.name,
                    otherUid: item.user._id,
                  },
                })
              }>
              <UserInfo>
                <UserImgWrapper>
                  <UserImg source={{uri: item.user.avatar}} />
                </UserImgWrapper>
                <TextSection>
                  <UnReadMessageCount>
                    <PostTime>{item.createdAt}</PostTime>
                    <BtnText>{item.count}</BtnText>
                  </UnReadMessageCount>
                  <UserInfoText>
                    <UserName>{item.user.name}</UserName>
                    <PostTime>{item.createdAt}</PostTime>
                  </UserInfoText>
                  <UserInfoText>
                    <MessageText>{item.text}</MessageText>
                  </UserInfoText>
                </TextSection>
              </UserInfo>
            </Card>
          )}
        />
      </Container>
      <SpotifyTab />
    </>
  );
};

export default ChatingList;

const NavText = styled.Text`
  color: #9b59b6;
  font-size: 30;
  padding: 15px;
`;
const UnReadMessageCount = styled.TouchableOpacity`
  margin: 1px;
  padding: 8px;
  background-color: #b7b4df;
  border-radius: 7px;
`;
const BtnText = styled.Text`
  font-size: 10px;
  color: white;
`;
