import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOverlay } from '../../../controls/loading-overlay/loading-overlay';
import Zoom from '../../../controls/zoom/zoom';

export function LocusLD() {
  const { submitted, ldError, request, isLoading, isLoadingLD } = useSelector(
    (state) => state.qtlsGWAS
  );

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
      {submitted && ldError && (
        <LoadingOverlay
          active={true}
          content={<b className="text-danger">{ldError}</b>}
        />
      )}
      <LoadingOverlay active={isLoadingLD} />
      {submitted && !ldError && !isLoading && !isLoadingLD && (
        <Zoom
          plotURL={`api/results/${request}/LD_Output.png`}
          className="border rounded p-3"
          maxHeight="100%"
          //maxWidth= "1000px"
          //marginLeft= "200px"
        />
      )}
    </div>
  );
}
