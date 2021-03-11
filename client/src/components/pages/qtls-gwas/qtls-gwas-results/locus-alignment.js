import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';

export function LocusAlignment() {
    const {
        loadSampleQTLs,
        loadSampleGWAS,
        associationFile,
        quantificationFile,
        genotypeFile,
        ldFile,
        gwasFile,
        distance,
        refSNP,
        population,
        refGene,
        refSNPPost,
        submitted,
        isLoading
    } = useSelector(({ezQTL}) => ezQTL.qtlsGWAS);

    return (
        <div className="p-2" style={{minHeight: '500px'}}>
            {
                !submitted &&
                <LoadingOverlay active={true} content={'Select data in the left panel and click Calculate to see results here.'} />
            }
            {
                submitted && 
                (
                    <>
                        Locus Alignment RESULTS
                    </>
                )
            }
        </div>
    )
}