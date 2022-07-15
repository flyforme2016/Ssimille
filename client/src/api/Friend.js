import axios from 'axios';
import Config from 'react-native-config';

const BASE_URL = Config.BASE_URL;

export const addFriend = async (myUid, otherUid) => {
  try {
    await axios.post(`${BASE_URL}/friend`, {
      myUid: myUid,
      otherUid: otherUid,
    });
  } catch {
    err => console.log(err);
  }
};

export const deleteFriend = async (myUid, otherUid) => {
  try {
    await axios.delete(
      `${BASE_URL}/friend?myUid=${myUid}&otherUid=${otherUid}`,
    );
  } catch {
    err => console.log(err);
  }
};

export const checkIsFriend = async (myUid, otherUid) => {
  //친구 = 1, 친구x = 0, 나 = -1
  if (myUid === String(otherUid)) {
    return -1;
  } else {
    try {
      const result = await axios.get(
        `${BASE_URL}/friend/flag?myUid=${myUid}&otherUid=${otherUid}`,
      );
      return result.isFriend;
    } catch {
      err => console.log(err);
    }
  }
};
