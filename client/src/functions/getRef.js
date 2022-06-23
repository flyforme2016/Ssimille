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