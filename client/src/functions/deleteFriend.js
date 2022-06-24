import Config from 'react-native-config'
const BASE_URL = Config.BASE_URL;

//type 1 : 친구신청, 0:게시글
//dataObject : userData/postData
const deleteFriend = (myUid, otherUid) => { 
    const requestOptions = {
        method: 'DELETE',
        redirect: 'follow',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
      };
    fetch(`${BASE_URL}/friend/removeFriend?myUid=${myUid}&otherUid=${otherUid}`, requestOptions)
    .then(res=>console.log('res: ', res))
    .catch(err=>console.log('err: ', err))

};

export default deleteFriend;


