import {
    UPDATE_KEY,
    UPDATE_QTLS_GWAS,
    UPDATE_ERROR
  } from './actions';
  
  export const rootReducer = (state, action) => {
    switch (action.type) {
        case UPDATE_KEY:
            return {
            ...state,
            [action.key]: action.data
            };
        case UPDATE_QTLS_GWAS:
            return {
                ...state,
                qtlsGWAS: {
                ...state.qtlsGWAS,
                ...action.data
                }
            };
        case UPDATE_ERROR:
            return {
                ...state,
                errorModal: {
                ...state.errorModal,
                ...action.data
                }
            };
        default:
            return state;
    }
  };
  