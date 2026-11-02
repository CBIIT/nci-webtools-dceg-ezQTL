import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlotlyWrapper as Plot } from '../../../plots/plotly/plotly-wrapper';
// import { Button } from 'react-bootstrap';
import { updateQTLsGWAS } from '../../../../services/actions';

export function LocusAlignmentScatterPlot(params) {
  const dispatch = useDispatch();

  const plotContainer = useRef(null);

  const { locus_alignment_gwas_scatter } = useSelector(
    (state) => state.qtlsGWAS
  );

  const config = {
    responsive: true,
    toImageButtonOptions: {
      format: 'svg', // one of png, svg, jpeg, webp
      filename: 'locus_alignment_gwas_scatter',
      height: 700,
      width: 1000,
      scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
    },
    displaylogo: false,
    modeBarButtonsToRemove: [
      'hoverClosestCartesian',
      'hoverCompareCartesian',
      'lasso2d',
    ],
  };

  return (
    <>
      <div
        className="text-center my-3 position-relative mw-100"
        ref={plotContainer}
      >
        {locus_alignment_gwas_scatter.data && (
          <Plot
            className="override-cursor-default position-relative"
            data={locus_alignment_gwas_scatter.data}
            layout={locus_alignment_gwas_scatter.layout}
            config={config}
          />
        )}
      </div>
    </>
  );
}
