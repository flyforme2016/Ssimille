import {collection, doc} from 'firebase/firestore';
import {database} from '../config/firebase';

exports.chatsRef = (uid1, uid2) => {
    const chatsCollectionRef = collection(database, 'chats');
    const chatsDocumentRef = doc(chatsCollectionRef, uid1);
    const chatsFinalCollectionRef = collection(chatsDocumentRef, uid2);
    return chatsFinalCollectionRef
};

exports.chatListRef = (uid1, uid2) => {
    const chatListCollectionRef = collection(database, 'chatList');        //my chatList update
    const chatListDocumentRef = doc(chatListCollectionRef, uid1);
    const chatListFinalCollectionRef = collection(chatListDocumentRef, 'chatList');
    const chatListFinalDocumentRef = doc(chatListFinalCollectionRef, uid2)
    return chatListFinalDocumentRef
}

exports.myChatListCollectionRef = (uid1) => {
    const chatListCollectionRef = collection(database, 'chatList');        
    const chatListDocumentRef = doc(chatListCollectionRef, uid1);
    const chatListFinalCollectionRef = collection(chatListDocumentRef, 'chatList');
    return chatListFinalCollectionRef
}

exports.alarmColRef = (uid) => {
    const alarmCollectionRef = collection(database, 'Alarm')
    const alarmDocumentRef = doc(alarmCollectionRef, uid)
    const alarmFinalCollectionRef = collection(alarmDocumentRef, 'AlarmList')
    return alarmFinalCollectionRef
}

exports.alarmStackDocRef = (uid) => {
    const stackAlarmCollectionRef = collection(database, 'Alarm')
    const stackAlarmDocumentRef = doc(stackAlarmCollectionRef, uid)
    const stackAlarmCollectionRef2 = collection(stackAlarmDocumentRef, 'AlarmList')
    const stackAlarmFinalDocument = doc(stackAlarmCollectionRef2, 'stackAlarm')
    return stackAlarmFinalDocument
}

