import {doc, getDocs, deleteDoc, query, where} from 'firebase/firestore';
import getRef from '../functions/getRef'
import updateAlarmStack from './updateAlarmStack'

const deleteAlarm = (myUid, key) => {
    const alarmRef = getRef.alarmColRef(myUid)
    const alramStackRef = getRef.alarmStackDocRef(myUid)
    if(key){
        removeAlarmDoc()
        updateAlarmStack.decrease(alramStackRef)
    }else{
        removeTotalAlarmDoc()
    }
    async function removeAlarmDoc (){
        const q = query(alarmRef, where('deleteKey', '==', key));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(data => {
            const targetDoc = doc(alarmRef, data._key.path.segments[8])
            deleteDoc(targetDoc)
        });
    }

    async function removeTotalAlarmDoc (){
        const q = query(alarmRef);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(data => {
            const targetDoc = doc(alarmRef, data._key.path.segments[8])
            deleteDoc(targetDoc)
        });
    }
    
};

export default deleteAlarm;
