import { useDispatch, useSelector } from 'react-redux';
import { actions, getInitialState } from './store';
const axios = require('axios');


export function qtlsGWASCalculation(params) {
    return async function(dispatch, getState) {
        const qtlsGWASState = getState();
        console.log("qtlsGWASState", qtlsGWASState);
        
        dispatch(actions.updateKey({ 
            key: 'qtlsGWAS', 
            data: { 
                submitted: true,
                isLoading: true
            }
        }));
        
        axios.post('api/qtls-calculate-main', params)
            .then(function (response) {
                console.log(response);
                dispatch(actions.updateKey({ 
                    key: 'qtlsGWAS', 
                    data: { 
                        results: response 
                    }
                }));
            })
            .catch(function (error) {
                console.log(error);
                if (error) {
                    dispatch(actions.updateKey({ 
                        key: 'errorModal', 
                        data: { 
                            visible: true 
                        }
                    }));
                }
            })
            .then(function () {
                dispatch(actions.updateKey({ 
                    key: 'qtlsGWAS', 
                    data: { 
                        isLoading: false
                    }
                }));
            });  
    };
}