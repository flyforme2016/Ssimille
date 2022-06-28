import {getDoc, setDoc} from 'firebase/firestore';

exports.increase = (stackAlarmRef) => {
    async function increaseStack(){
        const stackAlarmDocSnap = await getDoc(stackAlarmRef)
        if(stackAlarmDocSnap.exists()){
            setDoc(stackAlarmRef, {
            stack : stackAlarmDocSnap.data().stack + 1
            })
        }else{
            setDoc(stackAlarmRef, {
            stack : 1
            })
        }
    }
    increaseStack()  
};

exports.decrease =(stackAlarmRef) => {
    async function decreaseStack(){
        const stackAlarmDocSnap = await getDoc(stackAlarmRef)
        setDoc(stackAlarmRef, {
            stack : stackAlarmDocSnap.data().stack - 1
            })
    }
    decreaseStack()  
}
  
  