import {
  UPDATE_KEY,
  UPDATE_QTLS_GWAS,
  UPDATE_MULTI_LOCI,
  UPDATE_ERROR,
  UPDATE_SUCCESS,
  UPDATE_ALERT,
} from './actions';
import _ from 'lodash';

function mergeObject(state, action) {
  return _.mergeWith(state, action.data, (obj, src) => {
    if (_.isArray(obj)) {
      return src;
    }
  });
}

export const rootReducer = (state, action) => {
  switch (action.type) {
    case UPDATE_KEY:
      return {
        ...state,
        [action.key]: action.data,
      };
    case UPDATE_QTLS_GWAS:
      return {
        ...state,
        qtlsGWAS: { ...mergeObject(state.qtlsGWAS, action) },
      };
    case UPDATE_MULTI_LOCI:
      return {
        ...state,
        multiLoci: { ...mergeObject(state.multiLoci, action) },
      };
    case UPDATE_ERROR:
      return {
        ...state,
        errorModal: {
          ...state.errorModal,
          ...action.data,
        },
      };
    case UPDATE_SUCCESS:
      return {
        ...state,
        successModal: {
          ...state.successModal,
          ...action.data,
        },
      };
    case UPDATE_ALERT:
      return {
        ...state,
        alert: {
          ...state.alert,
          ...action.data,
        },
      };
    default:
      return state;
  }
};
