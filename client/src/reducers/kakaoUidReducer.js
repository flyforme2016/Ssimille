import types from '../actions/ActionTypes';

const initialState = {
  kakaoUid: null,
};

const kakaoUidReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SAVE_KAKAO_UID:
      return {
        ...state,
        kakaoUid: action.payload,
      };
    default:
      return state;
  }
};

export default kakaoUidReducer;
