import { configureStore } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit';
import { qtlsGWASCalculation } from './actions';

export const getInitialState = () => ({
  qtlsGWAS: {
    select_qtls_samples: false,
    select_gwas_sample: false,
    associationFile: null,
    quantificationFile: null,
    genotypeFile: null,
    gwasFile: null,
    LDFile: null,
    request: '',
    select_pop: false,
    select_gene: null,
    select_dist: 100,
    select_ref: false,
    recalculateAttempt: false,
    recalculatePop: false,
    recalculateGene: false,
    recalculateDist: false,
    recalculateRef: false,
    submitted: false,
    isLoading: false,
    activeResultsTab: 'locus-alignment',
    results: null
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
    resetAll: getInitialState
  },
});

export default configureStore({
  reducer: {
    ezQTL: reducer
  }
})