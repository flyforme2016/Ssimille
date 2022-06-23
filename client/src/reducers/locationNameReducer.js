import types from '../actions/ActionTypes';

const initialState = {
  locationName: null,
};

const locationNameReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SAVE_USER_LOCATION_NAME:
      return {
        ...state,
        locationName: action.payload,
      };
    default:
      return state;
  }
};

export default locationNameReducer;
