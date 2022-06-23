import React, {useState, useLayoutEffect, useEffect} from 'react';
import {FlatList, Text} from 'react-native';
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
  orderBy,
  query,
  onSnapshot,
  doc,
  getDocs,
} from 'firebase/firestore';
import {database} from '../../config/firebase';
import SpotifyTab from '../../components/SpotifyTab';
import {useSelector} from 'react-redux';
import getChatListTime from '../../functions/getChatListTime';
import getMyUnReadMessageCount from '../../functions/getMyUnReadMessageCount';

const ChatingList = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const myData = useSelector(state => state.myProfile);
  const myUid = myData.myProfileData.kakao_user_number.toString();

  const chatListCollectionRef = collection(database, 'chatList');
  const chatListDocumentRef = doc(chatListCollectionRef, myUid);
  const chatListFinalCollectionRef = collection(chatListDocumentRef, 'chatList');
  const q = query(chatListFinalCollectionRef, orderBy('createdAt', 'desc'));

  useLayoutEffect(() => {
    getChatList();
  }, []);

  //chatList 입장시 한번만 채팅목록 가져오기 실시간 x
  async function getChatList() {
    console.log('start getChatList');
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async doc => {
      console.log('doc.data(): ', doc.data())
        const initialObject = {
          _id: doc.data()._id,
          createdAt: getChatListTime(doc.data().createdAt.toDate().toISOString()),
          text: doc.data().text,
          user: doc.data().setDocUserObj,
          count: await getMyUnReadMessageCount(myUid, doc.data().setDocUserObj._id)
        }
        setMessages(prev => [...prev, initialObject])
    })
  };

  //chatList에 있는 동안 기존 또는 새로운 상대에게 메세지가 오는 경우
  //onSnapshot listener로 실시간 감지하여 채팅목록 갱신
  const unsubscribe = onSnapshot(q, querySnapshot => {
    console.log('onSnapshot');
    console.log('messages: ', messages)
    querySnapshot.docChanges().map(change => { //chatList를 갱신할 때 messages 배열에서 modified된 index만 update.
      if(change.type === 'modified'){   //기존 상대에게 메세지가 오는 경우
        console.log('Enter modified: ', messages)               
        messages.map(async(object, index) => {
          console.log('change.doc.data(): ', change.doc.data())
          console.log('object: ', object)
          if(object.user._id === change.doc.data().setDocUserObj._id){
            console.log('Enter find')
            const replaceObject = {
              _id: change.doc.data()._id,
              createdAt: getChatListTime(change.doc.data().createdAt.toDate().toISOString()),
              text: change.doc.data().text,
              user: change.doc.data().setDocUserObj,
              count: await getMyUnReadMessageCount(myUid, change.doc.data().setDocUserObj._id)
            }
            let replaceMessages = [...messages]
            replaceMessages[index] = replaceObject
            setMessages(replaceMessages)
          }
        })
      }
      else if(change.type === 'added'){async () => {  //새로운 상대에게 메세지가 오는 경우
        const addObject = {
          _id: change.doc.data()._id,
          createdAt: getChatListTime(change.doc.data().createdAt.toDate().toISOString()),
          text: change.doc.data().text,
          user: change.doc.data().setDocUserObj,
          count: await getMyUnReadMessageCount(myUid, change.doc.data().setDocUserObj._id)
        }
        setMessages(prev => [...prev, addObject])
      }}
    })
  });

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
                navigation.push('Stack', {
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
                  <UserInfoText>
                    <UserName>{item.user.name}</UserName>
                    <PostTime>{item.createdAt}</PostTime>
                  </UserInfoText>
                  <UserInfoText>
                    <MessageText>{item.text}</MessageText>
                      {
                        item.count===0 ? (<Text></Text>):
                        (<Text>{item.count}</Text>)
                      }
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
