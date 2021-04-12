import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';
import Plot from '../../../controls/plot/plot';

export function LocusQC() {
  const {
    submitted,
    isError,
    request,
    isLoading,
    isLoadingQC
  } = useSelector((state) => state.qtlsGWAS);

  return (
    <div className="px-3 py-2" style={{ minHeight: '500px' }}>
      {!submitted && (
        <LoadingOverlay
          active={true}
          content={
            <>Select data in the left panel and click <b>Calculate</b> to see results here.</>
          }
        />
      )}
      {submitted && isError && (
        <LoadingOverlay
          active={true}
          content={
            <b className="text-danger">Please check input files. Reset form to try again.</b>
          }
        />
      )}
      {submitted && !isError && !isLoading && !isLoadingQC && (
        <>
          <Plot
            plotURL={`api/results/${request}/${request}_QC_overlapping.svg`}
            className="border rounded p-3 mb-2"
          />

          <Plot
            plotURL={`api/results/${request}/${request}_QC_zscore.svg`}
            className="border rounded p-3"
          />
        </>
      )}
    </div>
  );
}
