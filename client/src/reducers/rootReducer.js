import {combineReducers} from 'redux';
import profileImgReducer from './profileImgReducer';

const rootReducer = combineReducers({
  profileImg: profileImgReducer,
});

export default rootReducer;
