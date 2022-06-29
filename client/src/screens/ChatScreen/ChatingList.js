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
import {orderBy, query, onSnapshot} from 'firebase/firestore';
import SpotifyTab from '../../components/SpotifyTab';
import {useSelector} from 'react-redux';
import getChatListTime from '../../functions/getChatListTime';
import getRef from '../../functions/getRef';

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
    console.log('start getChatList');
    const subscrebe = onSnapshot(q, querySnapshot => {
      setMessages(
        querySnapshot.docs.map(doc => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate().toISOString(),
          text: doc.data().text,
          user: doc.data().setDocUserObj,
          stack: doc.data().stack,
        })),
      );
      return subscrebe;
    });
  }

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
                    <PostTime>{getChatListTime(item.createdAt)}</PostTime>
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
