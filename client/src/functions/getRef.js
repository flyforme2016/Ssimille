import {collection, doc} from 'firebase/firestore';
import {database} from '../config/firebase';

exports.chatsRef = (uid1, uid2) => {
    const chatsColRef = collection(database, 'chats');
    const chatsDocRef = doc(chatsColRef, uid1);
    const chatsFinalColRef = collection(chatsDocRef, uid2);
    return chatsFinalColRef
};

exports.chatListRef = (uid1, uid2) => {
    const chatListColRef = collection(database, 'chatList');        //my chatList update
    const chatListDocRef = doc(chatListColRef, uid1);
    const chatListColRef2 = collection(chatListDocRef, 'chatList');
    const chatListFinalDocRef = doc(chatListColRef2, uid2)
    return chatListFinalDocRef
}

exports.myChatListCollectionRef = (uid1) => {
    const chatListColRef = collection(database, 'chatList');
    const chatListDocRef = doc(chatListColRef, uid1);
    const chatListFinalColRef = collection(chatListDocRef, 'chatList');
    return chatListFinalColRef
}

exports.alarmColRef = (uid) => {
    const alarmColRef = collection(database, 'Alarm')
    const alarmDocRef = doc(alarmColRef, uid)
    const alarmFinalColRef = collection(alarmDocRef, 'AlarmList')
    return alarmFinalColRef
}

exports.alarmStackDocRef = (uid) => {
    const stackAlarmColRef = collection(database, 'Alarm')
    const stackAlarmDocRef = doc(stackAlarmColRef, uid)
    const stackAlarmColRef2 = collection(stackAlarmDocRef, 'AlarmList')
    const stackAlarmFinalDocRef = doc(stackAlarmColRef2, 'stackAlarm')
    return stackAlarmFinalDocRef
}

exports.currentMusicColRef = (regionCode) => {
    const currentMusicColRef = collection(database, 'currentMusic')
    const currentMusicDocRef = doc(currentMusicColRef, regionCode)
    const currentMusicFinalColRef = collection(currentMusicDocRef, 'userList')
    return currentMusicFinalColRef
}

exports.currentMusicDocRef = (regionCode, uid) => {
    const currentMusicColRef = collection(database, 'currentMusic')
    const currentMusicDocRef = doc(currentMusicColRef, regionCode)
    const currentMusicColRef2 = collection(currentMusicDocRef, 'userList')
    const currentMusicFinalDocRef = doc(currentMusicColRef2, uid)
    return currentMusicFinalDocRef
}

