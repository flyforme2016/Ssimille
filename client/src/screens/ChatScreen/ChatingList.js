import React, {useState, useLayoutEffect} from 'react';
import styled from 'styled-components/native';
import {orderBy, query, onSnapshot} from 'firebase/firestore';
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

  //chatList 입장시 한번만 채팅목록 가져오기 실시간
  async function getChatList() {
    const subscribe = onSnapshot(q, querySnapshot => {
      setMessages(
        querySnapshot.docs.map(doc => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate().toISOString(),
          text: doc.data().text,
          user: doc.data().setDocUserObj,
          stack: doc.data().stack,
        })),
      );
      return subscribe;
    });
  }

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

              <InfoSection>
                <PostTime>{getChatListTime(item.createdAt)}</PostTime>
                {item.stack === 0 ? null : (
                  <CountContainer>
                    <CountText>{item.stack}</CountText>
                  </CountContainer>
                )}
              </InfoSection>
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
  margin-bottom: 5px;
`;

const UserImg = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 10px;
`;
const ChatContainer = styled.View`
  margin: 8px;
  flex-direction: row;
`;

const InfoSection = styled.View`
  align-items: flex-end;
`;
const TextSection = styled.View`
  align-items: flex-start;
`;

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
