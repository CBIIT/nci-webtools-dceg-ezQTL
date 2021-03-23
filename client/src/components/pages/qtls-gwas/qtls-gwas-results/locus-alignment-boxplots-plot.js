import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlotlyWrapper as Plot } from '../../../plots/plotly/plotly-wrapper';
// import { Tooltip } from '../../../controls/tooltip/tooltip';
// import { Button } from 'react-bootstrap';

export function LocusAlignmentBoxplotsPlot(params) {
  const plotContainer = useRef(null);

  const {
    locus_alignment_boxplots,
  } = useSelector((state) => state.qtlsGWAS);

  // use local state to reset tooltip when this component unmounts
  const [tooltip, setTooltip] = useState({
    visible: false,
    data: {}
  });

  const updateTooltip = state =>
    setTooltip({
      ...tooltip,
      ...state
  });

  useEffect(() => updateTooltip({ visible: false }), []);

  const config = {
    responsive: true,
    toImageButtonOptions: {
      format: 'svg', // one of png, svg, jpeg, webp
      filename: 'locus_alignment_boxplots',
      height: 600,
      width: 660,
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
        {locus_alignment_boxplots.data && (
          <Plot
            className="override-cursor-default position-relative"
            data={locus_alignment_boxplots.data}
            layout={locus_alignment_boxplots.layout}
            config={config}
          />
      )}
      </div>
    </>
  );
}
