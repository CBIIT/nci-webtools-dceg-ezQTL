import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';

export function LocusAlignment() {
    const {
        select_qtls_samples,
        select_gwas_sample,
        associationFile,
        quantificationFile,
        genotypeFile,
        gwasFile,
        LDFile,
        request,
        select_pop,
        select_gene,
        select_dist,
        select_ref,
        recalculateAttempt,
        recalculatePop,
        recalculateGene,
        recalculateDist,
        recalculateRef,
        submitted,
        isLoading,
        results
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
            {
                results &&
                (
                    <code>
                        { JSON.stringify(results, null, 4) }
                    </code>
                )
            }
        </div>
    )
}