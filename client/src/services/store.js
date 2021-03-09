import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => ({
  errorModal: {
    visible: false,
    details: ``,
    message: `An error occured when requesting data. If this problem persists, please contact the administrator at <a href="mailto:FORGE2-TFWebAdmin@cancer.gov">FORGE2-TFWebAdmin@cancer.gov</a>.`,
  }
});

export const { actions, reducer } = createSlice({
  name: 'reduxState',
  initialState: getInitialState(),
  reducers: {
    updateKey: (state, action) => {
        return {
            ...state,
            [action.payload.key]: action.payload.data
        }
    },
    resetAll: getInitialState,
  },
});

export default configureStore({
  reducer: {
    reduxState: reducer
  }
})