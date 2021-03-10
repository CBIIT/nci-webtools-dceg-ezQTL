import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit';

export const getInitialState = () => ({
  qtlsGWAS: {
    loadSampleQTLs: false,
    loadSampleGWAS: false,
    associationFile: null,
    quantificationFile: null,
    genotypeFile: null,
    ldFile: null,
    gwasFile: null,
    distance: 100,
    refSNP: '',
    population: null,
    refGene: null,
    refSNPPost: null,
    submitted: false,
    isLoading: false
  },
  errorModal: {
    visible: false,
    details: ``,
    message: `An error occured when requesting data. If this problem persists, please contact the administrator at <a href="mailto:FORGE2-TFWebAdmin@cancer.gov">ezQTLWebAdmin@cancer.gov</a>.`,
  }
});

export const { actions, reducer } = createSlice({
  name: 'ezQTL',
  initialState: getInitialState(),
  reducers: {
    updateKey: (state, action) => {
        return {
            ...state,
            [action.payload.key]: {
              ...state[action.payload.key],
              ...action.payload.data
            }
        }
    },
    resetAll: getInitialState,
  },
});

export default configureStore({
  reducer: {
    ezQTL: reducer
  }
})