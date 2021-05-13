import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';
import Zoom from '../../../controls/zoom/zoom';

export function LocusQC() {
  const {
    submitted,
    qcError,
    request,
    isLoading,
    locus_qc,
    gwasFile,
    isLoadingQC,
  } = useSelector((state) => state.qtlsGWAS);

  return (
    <div className="px-3 py-2" style={{ minHeight: '500px' }}>
      {!submitted && (
        <LoadingOverlay
          active={true}
          content={
            <>
              Select data in the left panel and click <b>Calculate</b> to see
              results here.
            </>
          }
        />
      )}
      {submitted && qcError && (
        <LoadingOverlay
          active={true}
          content={<b className="text-danger">{qcError}</b>}
        />
      )}
      {submitted && locus_qc && !qcError && !isLoading && !isLoadingQC && (
        <>
          {locus_qc.length && (
            <div className="border mb-2">
              <div className="p-2 mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                {locus_qc[0]}
              </div>

              <div className="row">
                {locus_qc.slice(1).map((text, i) => {
                  const splitText = text.split('\n');
                  const firstLine = splitText.splice(0, 1) + '\n';
                  console.log(splitText);

                  return (
                    <div
                      className="col-md-4 px-4 mb-3"
                      key={i}
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      {splitText.length !== 0 ? (
                        <>
                          <b>{firstLine}</b>
                          {splitText.join('\n')}
                        </>
                      ) : (
                        <>{firstLine}</>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <Zoom
            plotURL={`api/results/${request}/${request}_QC_QTLminP.svg`}
            className="border rounded p-3 mb-2"
            maxHeight="800px"
          />

          {gwasFile ? <Zoom
            plotURL={`api/results/${request}/${request}_QC_overlapping.svg`}
            className="border rounded p-3 mb-2"
            maxHeight="1000px"
          /> :
            <div className="border rounded p-3 mb-2">No GWAS data.</div>
          }


          {gwasFile ? <Zoom
            plotURL={`api/results/${request}/${request}_QC_zscore.svg`}
            className="border rounded p-3"
            maxHeight="800px"
          /> :
            <div className="border rounded p-3 mb-2">No GWAS data.</div>
          }
        </>
      )}
    </div>
  );
}
