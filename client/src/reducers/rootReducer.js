import {combineReducers} from 'redux';
import kakaoUidReducer from './kakaoUidReducer';
import spotifyTokenReducer from './spotifyTokenReducer';
import myProfileReducer from './myProfileReducer';
import userLocationReducer from './userLocationReducer';
import myPostReducer from './myPostReducer';
import locationNameReducer from './locationNameReducer';

const rootReducer = combineReducers({
  kakaoUid: kakaoUidReducer,
  spotifyToken: spotifyTokenReducer,
  myProfile: myProfileReducer,
  userLocation: userLocationReducer,
  myPosts: myPostReducer,
  locationName: locationNameReducer,
});

export default rootReducer;
