import types from './ActionTypes';

exports.uploadProfileImgAction = parameter => {
  return {
    type: types.UPLOAD_PROFILE_IMG,
    payload: parameter,
  };
};

exports.saveKakaoUidAction = parameter => {
  return {
    type: types.SAVE_KAKAO_UID,
    payload: parameter,
  };
};

exports.saveSpotifyTokenAction = parameter => {
  return {
    type: types.SAVE_SPOTIFY_TOKEN,
    payload: parameter,
  };
};
exports.saveUserProfileAction = parameter => {
  return {
    type: types.SAVE_USER_PROFILE,
    payload: parameter,
  };
};
