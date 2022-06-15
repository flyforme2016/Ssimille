import {combineReducers} from 'redux';
import uploadProfileImgReducer from './uploadProfileImgReducer';
import updateProfileImgReducer from './updateProfileImgReducer';
import kakaoUidReducer from './kakaoUidReducer';
import spotifyTokenReducer from './spotifyTokenReducer';

const rootReducer = combineReducers({
  uploadProfileImg: uploadProfileImgReducer,
  updateProfileImg: updateProfileImgReducer,
  kakaoUid: kakaoUidReducer,
  spotifyToken: spotifyTokenReducer,
});

export default rootReducer;
