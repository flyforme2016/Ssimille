import React, {useState, useLayoutEffect} from 'react';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';
import {Dimensions} from 'react-native';
import {orderBy, query, onSnapshot} from 'firebase/firestore';
import getRef from '../functions/getRef';
import getPostTime from '../functions/getPostTime';
import {checkIsFriend} from '../api/Friend';
import updateAlarmStack from '../functions/updateAlarmStack';
import updateAlarmReadState from '../functions/updateAlarmReadState';
import Modal from 'react-native-modal';
import delteAlarm from '../functions/deleteAlarm';
const {width} = Dimensions.get('window');

const Notice = ({navigation}) => {
  const [alarmList, setAlarmList] = useState([]);
  const {kakaoUid} = useSelector(state => state.kakaoUid);
  const [modalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    getAlarmList();
  }, []);
  const getAlarmList = async () => {
    const alarmListRef = getRef.alarmColRef(kakaoUid); //my alarmList
    const q = query(alarmListRef, orderBy('createdAt', 'desc'));
    const subscribe = onSnapshot(q, querySnapshot => {
      setAlarmList(
        querySnapshot.docs.map(doc => ({
          createdAt: doc.data().createdAt,
          deleteKey: doc.data().deleteKey,
          moveKey: doc.data().moveKey,
          nickname: doc.data().nickname,
          profileImg: doc.data().profileImg,
          text: doc.data().text,
          type: doc.data().type,
          readState: doc.data().readState,
        })),
      );
      return subscribe;
    });
    console.log('alarmList : ', alarmList);
  };

  return (
    <Container>
      <NavText>Notice</NavText>
      <AlarmList
        data={alarmList}
        keyExtractor={item => item.id + ''}
        horizontal={false}
        renderItem={({item}) => (
          <Card
            style={
              item.readState
                ? {backgroundColor: 'white'}
                : {backgroundColor: '#b7b4df'}
            }
            width={width}
            delayLongPress={200}
            onPress={async () => {
              if (!item.readState) {
                //?????? ?????? ????????? ??????
                updateAlarmStack.decrease(getRef.alarmStackDocRef(kakaoUid));
                updateAlarmReadState(kakaoUid, item.deleteKey);
              }
              if (item.type) {
                //????????????
                const flag = await checkIsFriend(
                  kakaoUid,
                  item.moveKey, //???????????? ????????? ?????? moveKey = otherUid
                );
                navigation.push('Stack', {
                  screen: 'OtherUserProfile',
                  params: {
                    otherUid: item.moveKey,
                    isFriend: flag,
                  },
                });
              }
            }}
            onLongPress={async () => {
              setModalVisible(true);
            }}>
            <Contents>
              <UserImg>
                <Avatar source={{uri: item.profileImg}} />
              </UserImg>
              <Nickname>{item.nickname}</Nickname>
              <Text>?????? {item.text}</Text>
            </Contents>
            <TimeView>
              <Time>{getPostTime(item.createdAt)}</Time>
            </TimeView>
            <Modal
              onBackButtonPress={() => setModalVisible(false)}
              //isVisible Props??? State ?????? ???????????? On/off control
              isVisible={modalVisible}
              //??????????????? ????????? ????????? ???????????? ????????????, useNativeDriver Props??? True??? ?????? ???????????????.
              useNativeDriver={true}
              hideModalContentWhileAnimating={true}
              style={{flex: 1, justifyContent: 'flex-end'}}>
              <ModalContentsWrapper>
                <ModalButton
                  onPress={() => {
                    delteAlarm(kakaoUid);
                    setModalVisible(false);
                  }}>
                  <TrashImage
                    source={require('../assets/sample/trashCan.png')}
                  />
                  <ModalText>?????? ??????</ModalText>
                </ModalButton>
                <ModalButton
                  onPress={() => {
                    delteAlarm(kakaoUid, item.deleteKey);
                    setModalVisible(false);
                  }}>
                  <TrashImage
                    source={require('../assets/sample/trashCan.png')}
                  />
                  <ModalText>??????</ModalText>
                </ModalButton>
              </ModalContentsWrapper>
            </Modal>
          </Card>
        )}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: #ffffff;
`;
const NavText = styled.Text`
  color: #9b59b6;
  font-size: 20;
  padding: 15px;
`;
const AlarmList = styled.FlatList``;
const Card = styled.TouchableOpacity`
  width: ${({width}) => width * 0.9};
  border-radius: 20px;
  background-color: #ffffff;
  flex-direction: row;
  align-items: center;
  justify-content: space-between
  margin-top: 5px;
  elevation: 3;
`;

const Contents = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const UserImg = styled.View`
  padding-top: 8px;
  padding-left: 8px;
  padding-bottom: 8px;
  margin-right: 8px;
`;
const Avatar = styled.Image`
  width: 35px;
  height: 35px;
  border-radius: 25px;
`;
const Nickname = styled.Text`
  font-size: 12px;
  color: black;
  font-weight: bold;
`;

const Text = styled.Text`
  font-size: 12px;
  color: black;
`;
const TimeView = styled.View`
  align-items: flex-end;
`;

const Time = styled.Text`
  font-size: 12px;
  color: black;
  margin-right: 10px;
`;

const ModalContentsWrapper = styled.View`
  flex-direction: row;
`;

const ModalButton = styled.TouchableOpacity`
  /* Modal Button?????? ????????? ?????? ????????? ???????????? ?????? ????????? flex??? ??? */
  flex: 1;
  flex-direction: row;
  height: 70;
  justify-content: center;
  align-items: center;
  background-color: white;
  border: 1px white;
  border-radius: 10px;
  margin: 30px;
  margin-bottom: 10px;
`;

const TrashImage = styled.Image`
  width: 30px;
  height: 30px;
`;

const ModalText = styled.Text`
  color: red;
  font-size: 15px;
`;

export default Notice;
