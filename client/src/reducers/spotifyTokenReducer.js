import types from '../actions/ActionTypes';

const initialState = {
  spotifyToken: null,
};

const spotifyTokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SAVE_SPOTIFY_TOKEN:
      return {
        ...state,
        spotifyToken: action.payload,
      };
    default:
      return state;
  }
};

export default spotifyTokenReducer;
