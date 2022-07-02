import {setDoc} from 'firebase/firestore';

const updateCurrentMusic = (currentMusicDocRef, myProfileData, musicData) => {
  const finalObject = {
    uid: myProfileData.kakao_user_number,
    nickname: myProfileData.nickname,
    profileImg: myProfileData.profile_image,
    musicUri: musicData.track.uri,
    albumTitle: musicData.track.name,
    albumArtistName: musicData.track.artist.name,
    albumImg: musicData.track.album.uri,
  };
  try {
    setDoc(currentMusicDocRef, finalObject);
  } catch {
    err => console.log(err);
  }
};

export default updateCurrentMusic;
