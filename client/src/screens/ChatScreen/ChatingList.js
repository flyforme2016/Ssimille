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
  orderBy,
  query,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import SpotifyTab from '../../components/SpotifyTab';
import {useSelector} from 'react-redux';
import getChatListTime from '../../functions/getChatListTime';
import getRef from '../../functions/getRef'

const ChatingList = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const myData = useSelector(state => state.myProfile);
  const myUid = myData.myProfileData.kakao_user_number.toString();

  const myChatListCollectionRef = getRef.myChatListCollectionRef(myUid)
  const q = query(myChatListCollectionRef, orderBy('createdAt', 'desc'));

  useLayoutEffect(() => {
    getChatList();
  }, []);

  //chatList 입장시 한번만 채팅목록 가져오기 실시간 x
  async function getChatList() {
    console.log('start getChatList');
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      console.log('doc.data(): ', doc.data())
    })
    querySnapshot.forEach( doc => {
      const initObject = {
        _id: doc.data()._id,
        createdAt: getChatListTime(doc.data().createdAt.toDate().toISOString()),
        text: doc.data().text,
        user: doc.data().setDocUserObj,
        stack: doc.data().stack,
      }
      setMessages(messages=>[...messages, initObject])
    })
  };

  //chatList에 있는 동안 기존 또는 새로운 상대에게 메세지가 오는 경우
  //onSnapshot listener로 실시간 감지하여 채팅목록 갱신
  const unsubscribe = onSnapshot(q, querySnapshot => {
    console.log('onSnapshot');
    console.log('messages: ', messages)
    querySnapshot.docChanges().map(change => { //chatList를 갱신할 때 messages 배열에서 modified된 index만 update.
      console.log('Enter change')
      if(change.type === 'modified'){   //기존 상대에게 메세지가 오는 경우
        console.log('Enter modified: ', messages)               
        messages.map(async(object, index) => {
          console.log('change.doc.data(): ', change.doc.data())
          console.log('object: ', object)
          if(object.user._id === change.doc.data().setDocUserObj._id){
            console.log('Enter find')
            const changeObject = {
              _id: change.doc.data()._id,
              createdAt: getChatListTime(change.doc.data().createdAt.toDate().toISOString()),
              text: change.doc.data().text,
              user: change.doc.data().setDocUserObj,
              stack: change.doc.data().stack
            }
            let replaceMessages = [...messages]
            replaceMessages[index] = changeObject
            setMessages(replaceMessages)
          }
        })
      }
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
                    {item.stack === 0 ? null : (
                      <CountContainer>
                        <CountText>{item.stack}</CountText>
                      </CountContainer>
                    )}
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

const CountContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 23;
  height: 23;

  background-color: #b7b4df;
  border-radius: 50;
`;
const CountText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: white;
`;
