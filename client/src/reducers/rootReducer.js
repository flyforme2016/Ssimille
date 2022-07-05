import {combineReducers} from 'redux';
import kakaoUidReducer from './kakaoUidReducer';
import spotifyTokenReducer from './spotifyTokenReducer';
import myProfileReducer from './myProfileReducer';
import userLocationReducer from './userLocationReducer';
import locationNameReducer from './locationNameReducer';
import myGenresReducer from './myGenresReducer';

const rootReducer = combineReducers({
  kakaoUid: kakaoUidReducer,
  spotifyToken: spotifyTokenReducer,
  myProfile: myProfileReducer,
  userLocation: userLocationReducer,
  locationName: locationNameReducer,
  myGenres: myGenresReducer,
});

export default rootReducer;
