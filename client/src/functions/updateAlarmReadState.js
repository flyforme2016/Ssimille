import {doc, getDocs, updateDoc, query, where} from 'firebase/firestore';
import getRef from '../functions/getRef'

const updateAlarmReadState = (myUid, key) => {
    async function changeDocData (){
        const alarmRef = getRef.alarmColRef(myUid)
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
    changeDocData()
};

export default updateAlarmReadState

  