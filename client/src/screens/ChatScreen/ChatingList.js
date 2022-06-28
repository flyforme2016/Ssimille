import React, {useState, useLayoutEffect} from 'react';
import styled from 'styled-components/native';
import {orderBy, query, onSnapshot, getDocs} from 'firebase/firestore';
import SpotifyTab from '../../components/SpotifyTab';
import {useSelector} from 'react-redux';
import getChatListTime from '../../functions/getChatListTime';
import getRef from '../../functions/getRef';
import {Dimensions} from 'react-native';
const {width} = Dimensions.get('window');

const ChatingList = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const myData = useSelector(state => state.myProfile);
  const myUid = myData.myProfileData.kakao_user_number.toString();

  const myChatListCollectionRef = getRef.myChatListCollectionRef(myUid);
  const q = query(myChatListCollectionRef, orderBy('createdAt', 'desc'));

  useLayoutEffect(() => {
    getChatList();
  }, []);

  //chatList 입장시 한번만 채팅목록 가져오기 실시간 x
  async function getChatList() {
    console.log('start getChatList');
    const subscrebe = onSnapshot(q, querySnapshot => {
      setMessages(
        querySnapshot.docs.map(doc => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt,
          text: doc.data().text,
          user: doc.data().setDocUserObj,
          stack: doc.data().stack,
        })),
      );
    });
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach(doc => {
    //   console.log('doc.data(): ', doc.data())
    // })
    // querySnapshot.forEach( doc => {
    //   const initObject = {
    //     _id: doc.data()._id,
    //     createdAt: getChatListTime(doc.data().createdAt.toDate().toISOString()),
    //     text: doc.data().text,
    //     user: doc.data().setDocUserObj,
    //     stack: doc.data().stack,
    //   }
    //   setMessages(messages=>[...messages, initObject])
    // })
  }

  //chatList에 있는 동안 기존 또는 새로운 상대에게 메세지가 오는 경우
  //onSnapshot listener로 실시간 감지하여 채팅목록 갱신
  const unsubscribe = onSnapshot(q, querySnapshot => {
    console.log('onSnapshot');
    console.log('messages: ', messages);
    querySnapshot.docChanges().map(change => {
      //chatList를 갱신할 때 messages 배열에서 modified된 index만 update.
      console.log('Enter change');
      if (change.type === 'modified') {
        //기존 상대에게 메세지가 오는 경우
        console.log('Enter modified: ', messages);
        messages.map(async (object, index) => {
          console.log('change.doc.data(): ', change.doc.data());
          console.log('object: ', object);
          if (object.user._id === change.doc.data().setDocUserObj._id) {
            console.log('Enter find');
            const changeObject = {
              _id: change.doc.data()._id,
              createdAt: getChatListTime(
                change.doc.data().createdAt.toDate().toISOString(),
              ),
              text: change.doc.data().text,
              user: change.doc.data().setDocUserObj,
              stack: change.doc.data().stack,
            };
            let replaceMessages = [...messages];
            replaceMessages[index] = changeObject;
            setMessages(replaceMessages);
          }
        });
      }
    });
  });

  return (
    <>
      <Container>
        <NavText>채팅창</NavText>
        <ChatList
          data={messages}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <Card
              width={width}
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
              <ChatContainer>
                <UserImg source={{uri: item.user.avatar}} />
                <TextSection>
                  <InfoText>{item.user.name}</InfoText>
                  <InfoText>{item.text}</InfoText>
                </TextSection>
              </ChatContainer>

              <TextSection>
                <PostTime>
                  {getChatListTime(item.createdAt.toDate().toISOString())}
                </PostTime>
                {item.stack === 0 ? null : (
                  <CountContainer>
                    <CountText>{item.stack}</CountText>
                  </CountContainer>
                )}
              </TextSection>
            </Card>
          )}
        />
      </Container>
      <SpotifyTab />
    </>
  );
};

export default ChatingList;

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #ffffff;
  font-family: 'Lato-Regular';
`;
const NavText = styled.Text`
  color: #9b59b6;
  font-size: 20px;
  padding: 15px;
`;
const ChatList = styled.FlatList``;

const Card = styled.TouchableOpacity`
  width: ${({width}) => width * 0.9};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
  padding-bottom: 5px;
`;

const UserImg = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 10px;
`;
const ChatContainer = styled.View`
  flex-direction: row;
`;

const TextSection = styled.View``;

const InfoText = styled.Text``;

const PostTime = styled.Text`
  font-size: 12px;
`;
const CountContainer = styled.View`
  width: 20;
  height: 20;
  border-radius: 10;
  align-items: center;
  justify-content: center;
  background-color: #b7b4df;
`;
const CountText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: white;
`;
