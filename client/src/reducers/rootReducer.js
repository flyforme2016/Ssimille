import {combineReducers} from 'redux';
import uploadProfileImgReducer from './uploadProfileImgReducer';
import kakaoUidReducer from './kakaoUidReducer';
import spotifyTokenReducer from './spotifyTokenReducer';
import myProfileReducer from './myProfileReducer';
import userLocationReducer from './userLocationReducer';

const rootReducer = combineReducers({
  uploadProfileImg: uploadProfileImgReducer,
  kakaoUid: kakaoUidReducer,
  spotifyToken: spotifyTokenReducer,
  myProfile: myProfileReducer,
  userLocation: userLocationReducer,
});

export default rootReducer;
