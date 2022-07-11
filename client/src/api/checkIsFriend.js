import Config from 'react-native-config';
const checkIsFriend = async (myUid, otherUid) => {
  const BASE_URL = Config.BASE_URL;

  //친구 = 1, 친구x = 0, 나 = -1
  if (myUid === String(otherUid)) {
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
      `${BASE_URL}/friend/flag?myUid=${myUid}&otherUid=${otherUid}`,
      requestOptions,
    )
  ).json();
  return result.isFriend;
};

export default checkIsFriend;
