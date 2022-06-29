import types from './ActionTypes';

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
exports.saveUserLocation = parameter => {
  return {
    type: types.SAVE_USER_LOCATION,
    payload: parameter,
  };
};
exports.saveUserLocationName = parameter => {
  return {
    type: types.SAVE_USER_LOCATION_NAME,
    payload: parameter,
  };
};
exports.saveMyPosts = parameter => {
  return {
    type: types.SAVE_MY_POST,
    payload: parameter,
  };
};
