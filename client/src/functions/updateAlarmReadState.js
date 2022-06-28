import {doc, getDocs, updateDoc, query, where} from 'firebase/firestore';
import getRef from '../functions/getRef'

const updateAlarmReadState = (myUid, key) => {
    async function test (){
        const alarmRef = getRef.alarmRef(myUid)
        console.log('key: ', key)
        const q = query(alarmRef, where('deleteKey', '==', key));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(data => {
            const targetDoc = doc(alarmRef, data._key.path.segments[8])
            updateDoc(targetDoc, {
                readState: 1
            })
        });
    }
    test()


    // const stackAlarmDocSnap = await getDoc(stackAlarmRef)
    // async function increaseStack(){
    //     const stackAlarmDocSnap = await getDoc(stackAlarmRef)
    //     if(stackAlarmDocSnap.exists()){
    //         setDoc( , {
    //         stack : stackAlarmDocSnap.data().stack + 1
    //         })
    //     }else{
    //         setDoc(stackAlarmRef, {
    //         stack : 1
    //         })
    //     }
    // }
    // increaseStack()  
};

export default updateAlarmReadState

  