import { useDispatch, useSelector } from 'react-redux';
import { actions, getInitialState } from './store';

export function qtlsGWASCalculation() {
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
        setTimeout(()=> {
            dispatch(actions.updateKey({ 
                key: 'qtlsGWAS', 
                data: { 
                    isLoading: false
                }
            }));
        }, 3000);
    };
}