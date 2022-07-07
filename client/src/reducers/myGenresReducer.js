import types from '../actions/ActionTypes';

const initialState = {
  myGenres: null,
};

const myGenresReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SAVE_MY_GENRES:
      return {
        ...state,
        myGenres: action.payload,
      };
    default:
      return state;
  }
};

export default myGenresReducer;
