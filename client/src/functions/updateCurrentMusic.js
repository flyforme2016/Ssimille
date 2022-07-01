import {setDoc} from 'firebase/firestore';

const updateCurrentMusic = (currentMusicDocRef, myProfileData, musicData) => {
    console.log('Enter updateCurrentMusic')
    const finalObject = {
        uid: myProfileData.kakao_user_number,
        nickname: myProfileData.nickname,
        profileImg: myProfileData.profile_image,
        musicUri: musicData.track.uri,
        albumTitle: musicData.track.name,
        albumArtistName: musicData.track.artist.name,
        albumImg: musicData.track.album.uri,
    }
    setDoc(currentMusicDocRef, finalObject)
};

export default updateCurrentMusic

  