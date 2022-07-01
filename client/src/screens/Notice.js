import React, {useState, useLayoutEffect} from 'react';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';
import {Dimensions} from 'react-native';
import {orderBy, query, onSnapshot} from 'firebase/firestore';
import getRef from '../functions/getRef';
import getPostTime from '../functions/getPostTime';
import checkIsFriend from '../api/checkIsFriend';
import updateAlarmStack from '../functions/updateAlarmStack';
import updateAlarmReadState from '../functions/updateAlarmReadState';
import Modal from "react-native-modal";
import delteAlarm from '../functions/deleteAlarm'
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
          <Card style={item.readState ? {backgroundColor:'white'} : {backgroundColor: '#b7b4df'}}
            width={width}
            delayLongPress={200}
            onPress={async () => {
              if (!item.readState) {
                //읽지 않은 알림인 경우
                updateAlarmStack.decrease(getRef.alarmStackDocRef(kakaoUid));
                updateAlarmReadState(kakaoUid, item.deleteKey);
              }
              if (item.type) {
                //친구요청
                const flag = await checkIsFriend(
                  kakaoUid,
                  item.moveKey, //친구요청 알림인 경우 moveKey = otherUid
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
              setModalVisible(true)
            }}
            >
            <Contents>
              <UserImg>
                <Avatar source={{uri: item.profileImg}} />
              </UserImg>
              <Nickname>{item.nickname}</Nickname>
              <Text>님이 {item.text}</Text>
            </Contents>
            <TimeView>
              <Time>{getPostTime(item.createdAt)}</Time>
            </TimeView>
            <Modal
              onBackButtonPress={ () => setModalVisible(false)}
              //isVisible Props에 State 값을 물려주어 On/off control
              isVisible={modalVisible}
              //아이폰에서 모달창 동작시 깜박임이 있었는데, useNativeDriver Props를 True로 주니 해결되었다.
              useNativeDriver={true}
              hideModalContentWhileAnimating={true}
              style={{ flex: 1,justifyContent: "flex-end"}}
            >
              <ModalContentsWrapper>
                  <ModalButton
                    onPress={() => {
                      delteAlarm(kakaoUid)
                      setModalVisible(false)
                    }}
                  >
                    <TrashImage source={require('../assets/sample/trashCan.png')}/>
                    <ModalText>전체 삭제</ModalText>
                  </ModalButton>
                  <ModalButton
                    onPress={() => {
                      delteAlarm(kakaoUid, item.deleteKey)
                      setModalVisible(false)
                    }}
                  >
                    <TrashImage source={require('../assets/sample/trashCan.png')}/>
                    <ModalText>삭제</ModalText>
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
  font-weight: bold
`

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
`

const ModalButton = styled.TouchableOpacity`
  /* Modal Button들의 모달창 내의 높이를 균일하게 하기 위하여 flex를 줌 */
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