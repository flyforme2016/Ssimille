import React, {useState, useLayoutEffect} from 'react';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';
import {Dimensions} from 'react-native';
import {orderBy, query, onSnapshot} from 'firebase/firestore';
import getRef from '../functions/getRef';
import getPostTime from '../functions/getPostTime';
import checkIsFriend from '../api/checkIsFriend';
import updateStackOfAlarm from '../functions/updateStackOfAlarm';
import updateAlarmReadState from '../functions/updateAlarmReadState';
const {width} = Dimensions.get('window');

const Notice = ({navigation}) => {
  const [alarmList, setAlarmList] = useState([]);
  const {kakaoUid} = useSelector(state => state.kakaoUid);

  useLayoutEffect(() => {
    getAlarmList();
  }, []);
  const getAlarmList = async () => {
    const alarmListRef = getRef.alarmRef(kakaoUid); //my alarmList
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
  };

  return (
    <Container>
      <NavText>Notice</NavText>
      <NoticeList
        data={alarmList}
        keyExtractor={item => item.id + ''}
        horizontal={false}
        renderItem={({item}) => (
          <Card
            width={width}
            onPress={async () => {
              if (!item.readState) {
                //읽지 않은 알림인 경우
                updateStackOfAlarm.decrease(getRef.stackAlarmDocRef(kakaoUid));
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
            }}>
            <Contents>
              <UserImg>
                <Avatar source={{uri: item.profileImg}} />
              </UserImg>
              <Text>
                {item.nickname}님이 {item.text}
              </Text>
              <Text>{getPostTime(item.createdAt)}</Text>
            </Contents>
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
const NoticeList = styled.FlatList``;
const Card = styled.TouchableOpacity`
  width: ${({width}) => width * 0.9};
  border-radius: 20px;
  background-color: #ffffff;
  flex-direction: row;
  align-items: center;
  margin: 8px;
  elevation: 3;
`;

const Contents = styled.View`
  flex-direction: row;
  align-items: center;
`;

const UserImg = styled.View`
  margin: 8px;
`;
const Avatar = styled.Image`
  width: 35px;
  height: 35px;
  border-radius: 25px;
`;
const Text = styled.Text`
  font-size: 12px;
`;

export default Notice;
