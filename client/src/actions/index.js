import types from './ActionTypes';

exports.uploadProfileImgAction = parameter => {
  return {
    type: types.UPLOAD_PROFILE_IMG,
    payload: parameter,
  };
};

exports.updateProfileImgAction = parameter => {
  return {
    type: types.UPDATE_PROFILE_IMG,
    payload: parameter,
  };
};
