import {combineReducers} from 'redux';
import uploadProfileImgReducer from './uploadProfileImgReducer';
import updateProfileImgReducer from './updateProfileImgReducer';
import kakaoUidReducer from './kakaoUidReducer';
import spotifyTokenReducer from './spotifyTokenReducer';
import myProfileReducer from './myProfileReducer';

const rootReducer = combineReducers({
  uploadProfileImg: uploadProfileImgReducer,
  updateProfileImg: updateProfileImgReducer,
  kakaoUid: kakaoUidReducer,
  spotifyToken: spotifyTokenReducer,
  myProfile: myProfileReducer,
});

export default rootReducer;
