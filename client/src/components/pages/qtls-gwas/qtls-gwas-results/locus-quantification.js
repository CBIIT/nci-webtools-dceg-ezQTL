import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Zoom from '../../../controls/zoom/zoom';

export function LocusQuantifiation() {

  const {
    request
  } = useSelector((state) => state.qtlsGWAS);

  return (
    <div className="px-3 py-2" style={{ minHeight: '500px' }}>
      <Zoom
        plotURL={`api/results/${request}/quantification_cor.svg`}
        className="border rounded p-3 mb-2"
        maxHeight="800px"
      />
      <Zoom
        plotURL={`api/results/${request}/quantification_dis.svg`}
        className="border rounded p-3 mb-2"
        maxHeight="800px"
      />
    </div>
  );
}
