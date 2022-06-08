import {combineReducers} from 'redux';
import uploadProfileImgReducer from './uploadProfileImgReducer';
import updateProfileImgReducer from './updateProfileImgReducer';

const rootReducer = combineReducers({
  uploadProfileImg: uploadProfileImgReducer,
  updateProfileImg: updateProfileImgReducer,
});

export default rootReducer;
