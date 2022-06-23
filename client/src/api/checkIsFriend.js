import Config from 'react-native-config';

const checkIsFriend = async (myUid, otherUid) => {
  const BASE_URL = Config.BASE_URL;
  console.log('Enter checkIsFriend');
  console.log('myUid: ', myUid, 'otherUid: ', otherUid);
  //친구 = 1, 친구x = 0, 나 = -1
  if (myUid.kakaoUid === String(otherUid)) {
    console.log('check point');
    return -1;
  }

  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const result = await (
    await fetch(
      `${BASE_URL}/friend/checkIsFriend?myUid=${myUid.kakaoUid}&otherUid=${otherUid}`,
      requestOptions,
    )
  ).json();
  console.log('checkIsFriend result: ', result);
  return result.isFriend;
};

export default checkIsFriend;
