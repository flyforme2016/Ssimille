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
  addDoc,
  setDoc,
  orderBy,
  query,
  onSnapshot,
  doc,
} from 'firebase/firestore';
import {database} from '../../config/firebase';
import SpotifyTab from '../../components/SpotifyTab';
import {useSelector} from 'react-redux';
// import {useSelector} from 'react-redux';

const ChatingList = ({navigation: {navigate, push}}) => {
  const [messages, setMessages] = useState();
  const myData = useSelector(state => state.myProfile);
  const myUid = myData.myProfileData.kakao_user_number.toString();
  // const myUid = useSelector(state => state.kakaoUid);
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
        setMessages(
          querySnapshot.docs.map(doc => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate().toString(),
            text: doc.data().text,
            user: doc.data().setDocUserObj,
          })),
        );
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
                  <UserInfoText>
                    <UserName>{item.user.name}</UserName>
                    <PostTime>{item.createdAt}</PostTime>
                  </UserInfoText>
                  <MessageText>{item.text}</MessageText>
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
